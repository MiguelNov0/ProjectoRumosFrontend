import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { Recipe } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { ProjetoRumosWebApiServicesService } from 'src/app/services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-recipe-favourites-list',
  templateUrl: './recipe-favourites-list.component.html',
  styleUrls: ['./recipe-favourites-list.component.css']
})
export class RecipeFavouritesListComponent implements OnInit {
  recipes: Recipe[]=[];
  subscription: Subscription;
  recipe:Recipe;
  user:User;

  constructor(private service:ProjetoRumosWebApiServicesService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
   
    this.service.loginUser.pipe(take(1)).subscribe(
      user=>{
        this.user=user;
      }
    );
    this.service.getFavourites(this.user.id);
    this.subscription = this.service.searchRecipesSub
    .subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
        console.log(recipes);
      }      
    );
  }

}
