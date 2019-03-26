import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-postlist',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.css']
})
export class PostlistComponent implements OnInit, OnDestroy {

  // posts=[
  //   {title: "First Post", content: "This is the first post\'s content."},
  //   {title: "Second Post", content: "This is the second post\'s content."},
  //   {title: "Third Post", content: "This is the third post\'s content."}
  // ];
  posts: Post[] =[];
  private postsSub: Subscription;
  
  constructor(public postService: PostsService) { }

  ngOnInit() {
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }


  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }
}
