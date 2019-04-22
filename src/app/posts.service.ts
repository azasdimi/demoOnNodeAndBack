import { Injectable } from "@angular/core";
import { Post } from "./post";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { stringify } from "@angular/core/src/render3/util";
import { Router } from "@angular/router";
import { NullTemplateVisitor } from "@angular/compiler";
import { elementStyleProp } from "@angular/core/src/render3";
import { matExpansionAnimations } from "@angular/material";

@Injectable({
  providedIn: "root"
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map(postData => {
          //this is map from rxjs/operators. returns an observable and changes the structure of the post containing new "_id"
          return {
            posts: postData.posts.map(post => {
              //returns a new array of posts mapped with the new "_id" inside. (this is callign the js map function)
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        //gets the transformed posts from the map operation above
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = {
    //   id: null,
    //   title: title,
    //   content: content
    // };
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {
        // const post: Post = {
        //   id: responseData.post.id,
        //   title: responseData.post.title,
        //   content: content,
        //   imagePath: responseData.post.imagePath
        // };
        // //get the post id from the response of the http post function to the db and add to the instance of post
        // // const id = responseData.postId;
        // // post.id = id;
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post = {
    //   id: id,
    //   title: title,
    //   content: content,
    //   imagePath: null
    // };
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }

    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        console.log(response);
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: "" //response.imagePath
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
    // .subscribe(() => {
    //   //update the posts list on the frontend so that it doesn't have to reload in order to delete a post from the frontend
    //   const updatedPosts = this.posts.filter(post => post.id !== postId); //return a new array without the post that is deleted
    //   this.posts = updatedPosts;
    //   this.postsUpdated.next([...this.posts]);
    // });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>("http://localhost:3000/api/posts/" + id);
    // return {...this.posts.find(p => p.id === id)};
  }
}
