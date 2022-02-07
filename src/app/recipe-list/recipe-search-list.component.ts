import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from 'src/app/models/recipe.model';
import { ProjetoRumosWebApiServicesService } from 'src/app/services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-recipe-search-list',
  templateUrl: './recipe-search-list.component.html',
  styleUrls: ['./recipe-search-list.component.css']
})
export class RecipeSearchListComponent implements OnInit {

  recipes: Recipe[]=[];
  subscription: Subscription;
  recipe:Recipe;

  constructor(private service:ProjetoRumosWebApiServicesService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.route.paramMap
    .subscribe(
      (params: Params) => {
        let str = params.get('search');
        console.log(params.get('search'));
        this.service.searchRecipes(str);
        this.subscription = this.service.searchRecipesSub
        .subscribe(
          (recipes: Recipe[]) => {
            this.recipes = recipes;
            console.log(recipes);
          }      
        );
      }
    );    
  }
}