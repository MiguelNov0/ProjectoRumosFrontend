import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BodyComponent } from './body/body.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';
import { ProfileComponent } from './users/profile/profile.component';
import { RecipeDetailsComponent } from './recipe-list/recipe-details/recipe-details.component';
import { RecipeEditComponent } from './recipe-list/recipe-edit/recipe-edit.component';
import { EditProfileComponent } from './users/profile/edit-profile/edit-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { RecipeSearchListComponent } from './recipe-list/recipe-search-list.component';
import { RecipeFavouritesListComponent } from './recipe-list/recipe-favourites-list/recipe-favourites-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    RecipeListComponent,
    RecipeItemComponent,
    UsersComponent,
    RecipeDetailsComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    RecipeEditComponent,
    EditProfileComponent,
    RecipeSearchListComponent,
    RecipeFavouritesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularEditorModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
