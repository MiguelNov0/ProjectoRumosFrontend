import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { take } from 'rxjs';
import { Recipe } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { Comment } from 'src/app/models/comment.model';
import { ProjetoRumosWebApiServicesService } from 'src/app/services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  //Receita
  recipe:Recipe;
  //Dono da receita
  recipeUser:User;
  //User logado
  //user da sessão atual
  user:User = JSON.parse(localStorage.getItem('userData'))
  //novo Comentario
  commentArea:string;
  
  //Comentarios da Receita
  comments:Comment[];
  //Numero de likes
  likes:number;
  //se o user ja gostou desta receita
  liked:boolean=false;
  //se o user ja favoritou esta receita
  favourite:boolean=false;

 constructor(private service:ProjetoRumosWebApiServicesService,  private route:ActivatedRoute, private router:Router) {

  }

  ngOnInit() { 

   //obter o id da receita atraves do route e ir buscar a receita ao array de receitas
    this.route.params
    .subscribe(
      (params: Params) => {
        this.service.recipesSub.subscribe(
          recipe=>{
            this.recipe=recipe.find(r=> r.id == params.id);
            console.log(this.recipe);
          }
        ),
        //obter o criador da receita
        this.service.getUserById(this.recipe.userId);
        this.service.userSub.subscribe(
          user=>{
            this.recipeUser=user;
          }        
        ),
        //obter o criador da receita
        this.service.getUserById(this.recipe.userId);
        this.service.userSub.subscribe(
          user=>{
            this.recipeUser=user;
          }
        )
      }
    );    
    //obter os comentarios
    this.service.getAllCommentsByRecipeId(this.recipe.id)
    this.service.commentsSub.subscribe(
      comments => {
       this.comments=comments;
      }
    );
    //Obter cotagem de likes
    this.service.getLikesCount(this.recipe.id).subscribe(
      likes=>{
        this.likes=likes.data;
        console.log(likes.data);
      }
    );
    //Obter informação se o user ja gostou desta receita
    this.service.getUserLikedRecipe(this.user.id, this.recipe.id).subscribe(
      response=>{
        this.liked=response.data;
        console.log(response);
      }
    );
    //Obter informação se o user ja gostou desta receita
    this.service.getUserFavouritedRecipe(this.user.id, this.recipe.id).subscribe(
    response=>{
      this.liked=response.data;
      console.log(response);
    });    
  }
    

  onLike(){
    this.service.addLike(this.recipe.id, this.user.id).subscribe(
      likes=>{
        this.likes=likes.data;
        console.log(likes.data);
      }
    );
    this.liked=true;

  }

  onDislike(){
    this.service.removeLike(this.recipe.id, this.user.id).subscribe(
      likes=>{
        this.likes=likes.data;
        console.log(likes.data);
      }
    );
    this.liked=false;
  }
  onFavourite(){
    this.service.addFavourite(this.recipe.id, this.user.id).subscribe(
      favourites=>{
        console.log(favourites.data);
      }
    );
    this.favourite=true;
  }
  onRemoveFavourite(){
    this.service.removeFavourite(this.recipe.id, this.user.id).subscribe(
      favourites=>{
        console.log(favourites.data);
      }
    );
    this.favourite=false;
  }
  onEditRecipe(){
    this.service.deleteRecipe(this.recipe.id);
    this.router.navigate(['edit'], {relativeTo:this.route})// adiciona /edit ao route atual ou seja (id/edit)
  }
  onDeleteRecipe(){
    this.service.deleteRecipe(this.recipe.id);
    this.router.navigate(['/recipes']);
  }

  onSubmit(comment:string){
    if(comment!=""){
      const newComment = new Comment(null,comment,this.user,this.recipe);
      this.service.addComment(newComment);
    }    
  }

}
