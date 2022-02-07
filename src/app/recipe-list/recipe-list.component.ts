import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { ProjetoRumosWebApiServicesService } from '../services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[];
  subscription: Subscription;

  constructor(private service:ProjetoRumosWebApiServicesService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        if(params['categoryName']){
          this.service.getRecipesByCategory(params['categoryName']);
          //se houve mudanças nas receitas recebe um novo array
          this.subscription = this.service.recipesSub
          .subscribe(
            (recipes) => {
              this.recipes = recipes;
              console.log(recipes);
            }      
          );
        }
        else{
          this.service.getAllRecipes();
          //se houve mudanças nas receitas recebe um novo array
          this.service.recipesSub
          .subscribe(
            (recipes) => {
              this.recipes=recipes;
              console.log(recipes);
            }      
          );
        }
      }
    );    
  }

}
