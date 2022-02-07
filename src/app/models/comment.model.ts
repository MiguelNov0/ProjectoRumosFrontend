import { Recipe } from "./recipe.model";
import { User } from "./user.model";

export class Comment{
   
    constructor(
        public id: number,
        public comment: string,
        public user:User,
        public recipe:Recipe){}
}