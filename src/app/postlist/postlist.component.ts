import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Post } from "../post";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";

@Component({
  selector: "app-postlist",
  templateUrl: "./postlist.component.html",
  styleUrls: ["./postlist.component.css"]
})
export class PostlistComponent implements OnInit, OnDestroy {
  // posts=[
  //   {title: "First Post", content: "This is the first post\'s content."},
  //   {title: "Second Post", content: "This is the second post\'s content."},
  //   {title: "Third Post", content: "This is the third post\'s content."}
  // ];
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;
  isLoading = false;

  constructor(public postService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
}
