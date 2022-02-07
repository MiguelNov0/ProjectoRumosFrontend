import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { ProjetoRumosWebApiServicesService } from 'src/app/services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLoading=false;
  error:string=null;

  constructor(private router:Router, private service:ProjetoRumosWebApiServicesService) { }

  ngOnInit(): void {
  }
  onSubmit(form:NgForm){
    if(!form.valid){
      return;
    }
    const newUser = new User(null, form.value.firstName,form.value.lastName,form.value.email,form.value.birthDate,form.value.password,false,null,null, null)
   
    this,this.isLoading=true;
    this.service.register(newUser).subscribe(
      response=>{
        console.log(response);
        this.isLoading=false;
        if(!response.success){
          this.error=response.message;
        }else{
          this.router.navigateByUrl("/login");
        }
    })
    form.reset();
  }

  onGoToLogin(){
    this.router.navigateByUrl("/login");
  }

}
