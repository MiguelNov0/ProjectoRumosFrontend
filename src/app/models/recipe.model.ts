import { Ingredient } from "./ingredient.model";

export class Recipe{

    constructor(
        public id:number,
        public name: string,
        public description: string,
        public creationDate: Date,
        public isVegan: boolean,
        public isVegetarian: boolean,
        public isLowCarb: boolean,
        public isGlutenFree: boolean,
        public isLactoseFree: boolean,
        public imagePath: string,
        public difficultyId: number,
        public categoryId:number,
        public portion: string,
        public prepTime: string,
        public userId: number,
        public ingredients:Ingredient[]){ }
}