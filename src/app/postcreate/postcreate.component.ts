import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-postcreate',
  templateUrl: './postcreate.component.html',
  styleUrls: ['./postcreate.component.css']
})
export class PostcreateComponent implements OnInit {
  enteredTitle='';
  enteredContent='';
  // postCreated = new EventEmitter();

  constructor(public postService: PostsService) { }

  ngOnInit() {
  }
 

  onAddPost(form: NgForm){
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };
    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

}
