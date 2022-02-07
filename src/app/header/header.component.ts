import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../models/category.model';
import { ProjetoRumosWebApiServicesService } from '../services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private userSubscription:Subscription;
  isAuthenticated=false;
  categories:Category[];
  searchQuery:string="";

  constructor(private service:ProjetoRumosWebApiServicesService, private router:Router) { }

  ngOnInit(): void {
    this.userSubscription=this.service.loginUser.subscribe(user=>{
      if(user){
        this.isAuthenticated=true;
      }else{
        this.isAuthenticated=false;
      }
    });

    this.service.categoriesSub
    .subscribe(
      categories=>{
      this.categories=categories;
      console.log(categories);
    });
  }


  onLogout(){
    this.service.logout();
  }
  ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
  }

}
