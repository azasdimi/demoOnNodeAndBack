import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { PostlistComponent } from './postlist/postlist.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostcreateComponent } from './postcreate/postcreate.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    PostlistComponent,
    PostcreateComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
