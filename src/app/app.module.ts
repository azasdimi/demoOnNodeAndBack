import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule, MatInputModule, MatCardModule, MatButtonModule } from '@angular/material';

import { AppComponent } from './app.component';
import { PostlistComponent } from './postlist/postlist.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostcreateComponent } from './postcreate/postcreate.component';

@NgModule({
  declarations: [
    AppComponent,
    PostlistComponent,
    PostcreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
