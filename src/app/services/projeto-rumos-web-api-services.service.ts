import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../models/user.model';
import { APIResponse } from '../models/APIResponse.model';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Recipe } from '../models/recipe.model';
import { Comment } from '../models/comment.model';
import { Difficulty } from '../models/difficulty.model';
import { Category } from '../models/category.model';
import { Image } from '../models/image.model';


@Injectable({
  providedIn: 'root'
})
export class ProjetoRumosWebApiServicesService {
  
  //guardar o user autenticado
  loginUser = new BehaviorSubject<User>(null);
  

  tokenExpirationTimer:any;

  //Guardar as Receitas da bd
  recipesSub = new BehaviorSubject<Recipe[]>(null);
  //Guardar as receitas da pesquisa
  searchRecipesSub = new BehaviorSubject<Recipe[]>(null);
  //guardar o user 
  userSub = new BehaviorSubject<User>(null);

  //Guardar os comentários da db
  commentsSub = new BehaviorSubject<Comment[]>(null);
  //Guardar imagens
  imagesSub = new BehaviorSubject<Image[]>(null);
  //Guardar categorias
  categoriesSub = new BehaviorSubject<Category[]>(null);
  //Error handling
  msg = new BehaviorSubject<string>(null);


  constructor(private httpClient:HttpClient, private router:Router) { }

  //Serviços de autenticação/user
  register(newUser:User){    
    return this.httpClient.post<APIResponse<User>>("https://localhost:44357/api/User/register",newUser);
  }

  login(email:string,password:string){
    let queryParams = new HttpParams()
    .set("email",email)    
    .set("password",password);
    console.log(email, password);
    return  this.httpClient.get("https://localhost:44357/api/User/login", {params:queryParams})
    .pipe(tap(
      (user:APIResponse<User>)=>{
        if(user.success==true){
          this.hadleAuthentication(user.data);
        }else{
          this.msg.next(user.message);
        }       
      })
    );
  }
  autoLogin(){
    //buscar os dados do user gravados no storage da aplicação como string e converte-los para um objecto do tipo User
    const user:User = JSON.parse(localStorage.getItem('userData'));
    if(!user){
      this.router.navigateByUrl("/login");
      return;
    }
    if(user.token){
      this.loginUser.next(user);
      const expiration = new Date(user.tokenExpirationDate).getTime()-new Date().getTime();
      this.autoLogout(expiration);
    }
  }

  logout(){
    this.loginUser.next(null);
    this.router.navigateByUrl('/login')
    //ao fazer logouut limpa os dados do user no broser
    localStorage.removeItem('userData');
    //se houver um timer ativo faz clear ao timer
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer=null;
    
  }

  private hadleAuthentication(user:User){
    this.loginUser.next(user);
    //inicia o Timer para o auto logout
    const expiration = new Date(user.tokenExpirationDate).getTime()-new Date().getTime();
    this.autoLogout(expiration);
    console.log(expiration);
    localStorage.setItem("userData", JSON.stringify(user));
  }


  autoLogout(expirationDuration:number){
    this.tokenExpirationTimer=setTimeout(()=>{
      this.logout();
    }, expirationDuration)
  }

  getUserById(userId:number){
    let queryParams = new HttpParams().append("userId", userId);  
    this.httpClient.get<APIResponse<User>>("https://localhost:44357/api/User/GetByUserId", {params:queryParams})
    .subscribe(
      user=>{
        //Para ser usado por outras components
        this.userSub.next(user.data);
        console.log(user.data);
      }
    );
  }
  changePassword(email:string, pw:string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '' });
    let queryParams = new HttpParams()
    .set("email",email)    
    .set("pw",pw);
    return  this.httpClient.post("https://localhost:44357/api/User/UpdatePassword", {headers:headers},{params:queryParams})
    .subscribe(response=>{
      console.log(response);
    });
  }

  changeEmail(email:string,updatedEmail:string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '' });
    let queryParams = new HttpParams()
    .set("email",email)    
    .set("updatedEmail",updatedEmail);
    return  this.httpClient.post("https://localhost:44357/api/User/UpdateEmail", {headers:headers},{params:queryParams})
    .subscribe(response=>{
      console.log(response);
    });
  }

  changeImage(email:string,imagePath:string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '' });    
    let queryParams = new HttpParams()
    .set("email",email)    
    .set("imagePath",imagePath);
    return  this.httpClient.post("https://localhost:44357/api/User/UpdateImage", {headers:headers},{params:queryParams})
    .subscribe(response=>{
      console.log(response);
    });
  }
  deleteUser(userId:number){
    let queryParams = new HttpParams().set("userId",userId)
    this.httpClient.delete("https://localhost:44357/api/User/Delete",{params:queryParams}).subscribe(
      response =>{
        console.log(response);
      }
    );
    this.logout();
  }
  
  //Serviços de Receitas
  getAllRecipes(){
    this.httpClient.get<APIResponse<Recipe[]>>("https://localhost:44357/api/Recipe/GetAll")
        .subscribe(
          (recipes) => {
            this.recipesSub.next(recipes.data);
            console.log(recipes.data);
          }
        );
  }
  getFavourites(userId){
    let queryParams = new HttpParams().set("userId",userId);
    return this.httpClient.get<APIResponse<Recipe[]>>("https://localhost:44357/api/Recipe/GetFavourites", {params:queryParams})
    .subscribe(
      (recipes) => {
        this.searchRecipesSub.next(recipes.data);
      }
    );
  }

  searchRecipes(searchQuery:string){
    let queryParams = new HttpParams().set("searchQuery",searchQuery);
    return this.httpClient.get<APIResponse<Recipe[]>>("https://localhost:44357/api/Recipe/Search", {params:queryParams})
    .subscribe(
      (recipes) => {
        this.searchRecipesSub.next(recipes.data);
      }
    );
  }
 
  addRecipe(recipe: Recipe){
    this.httpClient.post("https://localhost:44357/api/Recipe/Add",recipe).subscribe(
      response =>{
        console.log(response);
      }
    )
 }
 updateRecipe(recipe: Recipe){
   this.httpClient.put("https://localhost:44357/api/Recipe/Update",recipe).subscribe(
     response =>{
       console.log(response);
     }
   )
  } 

  getRecipesByCategory(categoryName:string){
    let queryParams = new HttpParams().set("categoryName", categoryName); 
    this.httpClient.get<APIResponse<Recipe[]>>("https://localhost:44357/api/Recipe/GetByCategory",{params:queryParams})
    .subscribe(
      (recipes) => {
        this.recipesSub.next(recipes.data);
      }
    );
  }

  getRecipe(id: number) {
    //retorna a Receita por id actualizada
    let queryParams = new HttpParams().set("recipeId", id); 
    return this.httpClient.get<APIResponse<Recipe>>("https://localhost:44357/api/Recipe/GetbyId",{params:queryParams}); 
  }
  deleteRecipe(id:number){
    let queryParams = new HttpParams().set("recipeId",id)
    this.httpClient.delete<APIResponse<Recipe[]>>("https://localhost:44357/api/Recipe/Delete",{params:queryParams}).subscribe(
      response =>{
        this.recipesSub.next(response.data);
        console.log(response);
      }
    );
  }

  //Likes Service
  getLikesCount(recipeId:number){
    let queryParams = new HttpParams().set("recipeId", recipeId); 
    return this.httpClient.get<APIResponse<number>>("https://localhost:44357/api/RecipeLikes/GetLikes",{params:queryParams});
  }

  addLike(recipeId:number, userId:number){
    let queryParams = new HttpParams()
    .set("recipeId", recipeId)
    .set("userId",userId);
    return this.httpClient.get<APIResponse<number>>("https://localhost:44357/api/RecipeLikes/AddLike",{params:queryParams});
  }
  removeLike(recipeId:number, userId:number){
    let queryParams = new HttpParams()
    .set("recipeId", recipeId)
    .set("userId",userId);
    return this.httpClient.get<APIResponse<number>>("https://localhost:44357/api/RecipeLikes/RemoveLike",{params:queryParams});
  }

  getUserLikedRecipe(userId:number, recipeId:number){
    let queryParams = new HttpParams()
    .set("recipeId", recipeId)
    .set("userId",userId);
    return this.httpClient.get<APIResponse<boolean>>("https://localhost:44357/api/RecipeLikes/CheckIfLiked",{params:queryParams});
  }

  //Favoritos Service
  addFavourite(recipeId:number, userId:number){
    let queryParams = new HttpParams()
    .set("recipeId", recipeId)
    .set("userId",userId);
    return this.httpClient.get<APIResponse<number>>("https://localhost:44357/api/Favourite/AddFavourite",{params:queryParams});
  }
  removeFavourite(recipeId:number, userId:number){
    let queryParams = new HttpParams()
    .set("recipeId", recipeId)
    .set("userId",userId);
    return this.httpClient.get<APIResponse<number>>("https://localhost:44357/api/Favourite/RemoveFavourite",{params:queryParams});
  }

  getUserFavouritedRecipe(userId:number, recipeId:number){
    let queryParams = new HttpParams()
    .set("recipeId", recipeId)
    .set("userId",userId);
    return this.httpClient.get<APIResponse<boolean>>("https://localhost:44357/api/Favourite/CheckIfFavourited",{params:queryParams});
  }

  //Difficculty & Category Service
  getDifficulty(difficultyId: number) {
    let queryParams = new HttpParams().set("difficultyId", difficultyId); 
    return this.httpClient.get<APIResponse<Difficulty>>("https://localhost:44357/api/Diffuculty/GetbyId",{params:queryParams});        
  }
  getCategory(categoryId: number) {
    let queryParams = new HttpParams().set("categoryId", categoryId); 
    return this.httpClient.get<APIResponse<Category>>("https://localhost:44357/api/Category/GetbyId",{params:queryParams});       
  }
  getAllCategories(){
    return this.httpClient.get<APIResponse<Category[]>>("https://localhost:44357/api/Category/GetAll")
    .subscribe(
      categories=>{
        this.categoriesSub.next(categories.data);
        console.log(categories);
      }
    );
  }

  //ImageService
  uploadImage(file:FormData){
    return this.httpClient.post<APIResponse<Image>>("https://localhost:44357/api/Image/upload",file);
  }
  getAllImages(){
    this.httpClient.get<APIResponse<Image[]>>("https://localhost:44357/api/Image/GetImages")
    .subscribe(images=>
      this.imagesSub.next(images.data)
      );
  }
  getImage(filePath:string){
    let queryParams = new HttpParams().set("filePath", filePath); 
    return this.httpClient.get<string>("https://localhost:44357/api/Image/GetImage",{params:queryParams});
  }

   //Serviços de Comentários
   addComment(newComment:Comment){
    let queryParams = new HttpParams()
    .set("newComment", newComment.comment)
    .set("userId",newComment.user.id)
    .set("recipeId",newComment.recipe.id);    
    this.httpClient.post<APIResponse<Comment[]>>("https://localhost:44357/api/RecipeComment/AddComment",{params:queryParams}).subscribe(
      response =>{
        console.log(response);
      });    
  }
  getAllCommentsByRecipeId(recipeId:number){
    let queryParams = new HttpParams().set("recipeId", recipeId); 
    this.httpClient.get<APIResponse<Comment[]>>("https://localhost:44357/api/RecipeComment/GetAllByRecipeId",{params:queryParams})
      .subscribe(
          (comments) =>{
            this.commentsSub.next(comments.data);           
          }
        );                
  }
}

