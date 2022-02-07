export class User{   
    constructor(
    public id:number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public birthDate: Date,
    public password:string,
    public isAdmin: boolean,
    public photoPath: string,
    public token:string,
    public tokenExpirationDate:Date){} 
 }