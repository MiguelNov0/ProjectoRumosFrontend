import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { Recipe } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { ProjetoRumosWebApiServicesService } from 'src/app/services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  subscription: Subscription;
  recipes: Recipe[];
  user:User;
  
  constructor(private service:ProjetoRumosWebApiServicesService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.service.loginUser.pipe(take(1)).subscribe(
      user=>{
        this.user=user;
      }
    );
    this.service.recipesSub.subscribe(recipes=>{
      this.recipes=recipes.filter(r=>r.userId==this.user.id);
    });

  }
  

}
