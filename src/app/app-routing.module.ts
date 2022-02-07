import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailsComponent } from './recipe-list/recipe-details/recipe-details.component';
import { RecipeEditComponent } from './recipe-list/recipe-edit/recipe-edit.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeSearchListComponent } from './recipe-list/recipe-search-list.component';
import { LoginComponent } from './users/login/login.component';
import { ProfileComponent } from './users/profile/profile.component';
import { RegisterComponent } from './users/register/register.component';

const routes: Routes = [
  {path: '', redirectTo: 'recipes', pathMatch: 'full'},
  {path:'profile', component:ProfileComponent},
  {path:'register', component:RegisterComponent},  
  {path:'login', component:LoginComponent},  
  {path:'recipes', component:RecipeListComponent},
  {path:'recipes/new', component:RecipeEditComponent},
  {path:'recipes/:categoryName', component:RecipeListComponent},
  {path:'recipes/search/:search', component:RecipeSearchListComponent},
  {path:'recipedetails/:id', component:RecipeDetailsComponent},
  {path:'recipedetails/:id/edit', component:RecipeEditComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
