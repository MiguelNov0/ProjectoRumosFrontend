export class APIResponse<T>{
    public data: T;
    public success: boolean;
    public message: string;
    
    
    constructor(
       data: T, success:boolean, message:string){
            this.data=data;
            this.success=success;
            this.message=message;
    }
}