import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { ProjetoRumosWebApiServicesService } from 'src/app/services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  //@Input para receber dados de fora deste component
  @Input() recipe: Recipe;

  //user da receita
  user:User;

  constructor(private router:Router, private service:ProjetoRumosWebApiServicesService) { 
  }

  ngOnInit(): void {
    console.log(this.recipe);
    this.service.getUserById(this.recipe.userId);
    this.service.userSub.subscribe(
      user=>{
        this.user=user;
      }
    )
    console.log(this.recipe);
  }

  //Ao clicar na receita mostra a pagina com a receita detalhada
  onClick(){
    this.router.navigateByUrl(`/recipedetails/${this.recipe.id}`);
  }

}
