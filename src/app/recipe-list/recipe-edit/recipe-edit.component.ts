import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { take } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Category } from 'src/app/models/category.model';
import { Difficulty } from 'src/app/models/difficulty.model';
import { Recipe } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { ProjetoRumosWebApiServicesService } from 'src/app/services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  recipeDesc:string;
  id: number;
  editMode=false;
  recipeForm:FormGroup;
  user:User;
  categories:Category[];
  // categoriesSub:Subscription;
  difficultyLevels:Difficulty[];
  // difficultyLevelsSub:Subscription;
  categorySelected:Category;
  difficultySelected:Difficulty;
  recipe:Recipe;

  

  constructor(public appComponent:AppComponent,private formBuilder:FormBuilder, private service:ProjetoRumosWebApiServicesService, private route:ActivatedRoute, private router:Router) { 
     }

  ngOnInit(): void {
    this.categories=[
      {id: 1,categoryName:"Básicos"},
      {id: 2,categoryName:"Entradas"},
      {id: 3,categoryName:"Sopas"},
      {id: 4,categoryName:"Acompanhamentos"},
      {id: 5,categoryName:"Salgados,Tartes e Pizas"},
      {id: 6,categoryName:"Arroz e Massas"},
      {id: 7,categoryName:"Pratos de Peixe"},
      {id: 8,categoryName:"Pratos de Carne"},
      {id: 9,categoryName:"Pratos Vegetarianos"},
      {id: 10,categoryName:"Pães"},
      {id: 11,categoryName:"Molhos, Temperos e Patês"},
      {id: 12,categoryName:"Geleias, Doces e Compotas"},
      {id: 13,categoryName:"Sobremesas"},
      {id: 14,categoryName:"Bolos e Biscoitos"},
      {id: 15,categoryName:"Bebidas"}
    ];
    this.difficultyLevels=[
      {id:1,difficultyLevel:"Fácil"},
      {id:2,difficultyLevel:"Média"},
      {id:3,difficultyLevel:"Difícil"}
     ];
     this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }


   onSubmit(){
   this.service.loginUser.pipe(take(1)).subscribe(
      user=>{
        this.user=user;
      }
    );
      this.difficultySelected;
      const newRecipe= new Recipe(
      null,
      this.recipeForm.value['name'],
      this.recipeForm.value['desc'],
      new Date(),
      this.recipeForm.value['isVegan'],
      this.recipeForm.value['isVegetarian'],
      this.recipeForm.value['isLowCarb'],
      this.recipeForm.value['isLactoFree'],
      this.recipeForm.value['isGlutenFree'],
      this.recipeForm.value['imgPath'],
      this.difficultySelected.id,
      this.categorySelected.id,
      this.recipeForm.value['portions'],
      this.recipeForm.value['prepTime'],
      this.user.id,
      this.recipeForm.value['ingredients']
    );
    if (this.editMode) {
      newRecipe.id=this.id;
      this.service.updateRecipe(newRecipe);
      this.router.navigateByUrl('/profile');
    } else {
      this.service.addRecipe(newRecipe);
      this.router.navigateByUrl("/Profile")
    }
  }
   
  onAddIngredient(){
    //obter o controlo de ingredientes
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        //cria-se um form control para cada campo e adiciona-se default values e validators
        'ingredientName':new FormControl(null, Validators.required),
        'quantity':new FormControl(null, [
          Validators.pattern(/[1-9]+[0-9]*$/ || "q.b." || "qb"),
          Validators.required 
        ]),
        'measurement':new FormControl(null, Validators.required )
      })
    )
  }
  onDeleteIngredient(index:number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);

  }
  onCancel(){
    this.router.navigateByUrl('/profile');
  }

  //iniciar o formulario
  private initForm(){    

    let recipeName="";
    let recipeImgPath="";
    let recipeDesc="";
    let recipeIsVegan=false;
    let recipeIsVegetarian=false;
    let recipeIsLowCarb=false;
    let recipeIsLactoFree=false;
    let recipeIsGlutenFree=false;
    let recipeDifficulty: Difficulty;
    let recipeCategory:Category;
    let recipePortions="";
    let recipePrepTime="";
    let recipeIngredients= new FormArray([]);
    
    //Se estiver em edit mode vai buscar o id
    if(this.editMode){
      this.service.recipesSub.subscribe(recipes=> this.recipe=recipes.find(r=> r.id==this.id));
      recipeName = this.recipe.name;
      recipeImgPath=this.recipe.imagePath;
      recipeDesc=this.recipe.description;
      recipeIsVegan=this.recipe.isVegan;
      recipeIsVegetarian=this.recipe.isVegetarian;
      recipeIsLowCarb=this.recipe.isVegetarian;
      recipeIsLactoFree=this.recipe.isLactoseFree;
      recipeIsGlutenFree=this.recipe.isGlutenFree;
      this.service.getDifficulty(this.recipe.difficultyId).subscribe(difficulty=>recipeDifficulty=difficulty.data);
      this.service.getCategory(this.recipe.categoryId).subscribe(category=>recipeCategory=category.data);
      recipePortions=this.recipe.portion;
      recipePrepTime=this.recipe.prepTime;
      //verificar se a receita tem ingredientes
      if (this.recipe['ingredients']) {
        for (let ingredient of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              //cria-se um form control para cada campo e atribui-se validação
              'ingredientName':new FormControl(ingredient.ingredientName, Validators.required),
              'quantity':new FormControl(ingredient.quantity, [
                Validators.pattern(/[1-9]+[0-9]*$|q.b.|qb/),
                Validators.required 
              ]),             
              'measurement':new FormControl(ingredient.measurement,Validators.required)
            })                        
          )          
        }
      }
    }
    this.recipeForm=this.formBuilder.group({
      'name': new FormControl(recipeName,Validators.required),
      'imgPath': new FormControl(recipeImgPath, Validators.required),
      'desc': new FormControl(recipeDesc),
      'isVegan':new FormControl(recipeIsVegan),
      'isVegetarian':new FormControl(recipeIsVegetarian),
      'isLowCarb':new FormControl(recipeIsLowCarb),
      'isLactoFree':new FormControl(recipeIsLactoFree),
      'isGlutenFree':new FormControl(recipeIsGlutenFree),
      'difficulty': new FormControl(recipeDifficulty,Validators.required),
      'category': new FormControl(recipeCategory,Validators.required),
      'portions':new FormControl(recipePortions,Validators.required),
      'prepTime':new FormControl(recipePrepTime,Validators.required),
      'ingredients':recipeIngredients
    });
  }
  get controls() { // a getter!
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  } 
  

}
