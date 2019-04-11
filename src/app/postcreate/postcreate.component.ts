import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Post } from "../post";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { read } from "fs";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-postcreate",
  templateUrl: "./postcreate.component.html",
  styleUrls: ["./postcreate.component.css"]
})
export class PostcreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  // postCreated = new EventEmitter();
  private mode = "create";
  private postId: string;
  post: Post;
  title;
  content;
  form: FormGroup;
  isLoading = false;
  imagePreview: string | ArrayBuffer;

  constructor(public postService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    //initialization of the form
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required]
        // asyncValidators: [mimeType]
      })
    });
    //using this built in observable to keep track of the parameter in the url
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        //show spinner
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          //hide spinner
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
        });
        this.form.setValue({
          title: this.post.title,
          content: this.post.content
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onSavePost() {
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }

    // form.resetForm();
    this.form.reset();
  }

  onImagePicked(event: Event) {
    //type conversion to make typescript understand that we are getting a file
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
    // console.log(file);
    // console.log(this.form);
  }
}
