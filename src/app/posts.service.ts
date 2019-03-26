import { Injectable } from '@angular/core';
import { Post } from './post';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor( private http: HttpClient) { }

  getPosts(){
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => { //this is map from rxjs/operators. returns an observable and changes the structure of the post containing new "_id"
        return postData.posts.map(post => { //returns a new array of posts mapped with the new "_id" inside. (this is callign the js map function)
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(transformedPosts => { //gets the transformed posts from the map operation above
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]); 
      });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string){
    const post: Post = {
      id: null,
      title: title,
      content: content
    };
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        //get the post id from the response of the http post function to the db and add to the instance of post
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string){
    this.http.delete("http://localhost:3000/api/posts" + postId)
      .subscribe(() => {
        //update the posts list on the frontend so that it doesn't have to reload in order to delete a post from the frontend
        const updatedPosts = this.posts.filter(post => post.id !== postId); //return a new array without the post that is deleted
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]); 
      });
  }

}
