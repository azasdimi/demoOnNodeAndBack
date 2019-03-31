import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-postcreate',
  templateUrl: './postcreate.component.html',
  styleUrls: ['./postcreate.component.css']
})
export class PostcreateComponent implements OnInit {
  enteredTitle='';
  enteredContent='';
  // postCreated = new EventEmitter();
  private mode = 'create';
  private postId: string;
  post: Post; 
  title;
  content;
  isLoading = false;

  constructor(public postService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    //using this built in observable to keep track of the parameter in the url
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        //show spinner
        this.isLoading=true;
        this.postService.getPost(this.postId)
          .subscribe(postData => {
            //hide spinner
            this.isLoading = false;
            this.post = { id: postData._id, title: postData.title, content: postData.content};
        });
      }
      else{
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
 

  onSavePost(form: NgForm){
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };
    this.isLoading = true;
    if(this.mode ==="create"){
      this.postService.addPost(form.value.title, form.value.content);
    }
    else{
      this.postService.updatePost(this.postId, form.value.title, form.value.content)
    }
    
    form.resetForm();
  }

}
