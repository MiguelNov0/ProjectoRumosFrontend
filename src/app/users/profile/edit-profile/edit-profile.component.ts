import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ProjetoRumosWebApiServicesService } from 'src/app/services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  email:string;
  email2:string;
  msg1:string
  pw:string;
  pw2:string;
  msg2:string
  img:string;

  user:User;
  userSubscription: any;

  constructor(private service:ProjetoRumosWebApiServicesService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.service.loginUser.pipe(take(1)).subscribe(
      user=>{
        this.user=user;
      }
    );
  }
  onSubmitEmail(){
    if(this.email!=this.email2){
      this.msg1="Os endereços não coincidem!"
    }else{
      this.service.changeEmail(this.user.email,this.email);
      this.service.logout();
    }    
  }

  onSubmitPw(){
    if(this.pw!=this.pw2){
      this.msg2="As Palavras-Passe não coincidem!"
    }else{
      this.service.changePassword(this.user.email,this.pw);
      this.service.logout();
    }
  }

  onSubmitImg(){
    this.service.changeImage(this.user.email, this.img);    
     this.service.logout();
  }

  onDeleteUser(){
    this.service.deleteUser(this.user.id);
  } 


}
