import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { PostlistComponent } from "../postlist/postlist.component";
import { PostcreateComponent } from "../postcreate/postcreate.component";
import { LoginComponent } from "../auth/login/login.component";
import { SignupComponent } from "../auth/signup/signup.component";

const routes: Routes = [
  { path: "", component: PostlistComponent },
  { path: "create", component: PostcreateComponent },
  { path: "edit/:postId", component: PostcreateComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
