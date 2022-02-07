import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetoRumosWebApiServicesService } from 'src/app/services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading=false;
  error: string=null;

  constructor(private router:Router, private service:ProjetoRumosWebApiServicesService) { }

  ngOnInit(): void {
  }
  //Ao Clicar em Ir para o Registo
  onGoToRegister(){
    this.router.navigateByUrl("/register");
  }
  //Ao Submeter o login
  onSubmit(form:NgForm){
    //extra passo de segurança
    if(!form.valid){
      return;
    }
    this.isLoading=true;
    this.service.login(form.value.email,form.value.password).subscribe(
      response=>{
        console.log(response);
        this.isLoading=false;
        if(!response.success){
          this.error=response.message;
        }else{
          this.router.navigateByUrl('/recipes');
        }        
    })
    form.reset();
  }
}
