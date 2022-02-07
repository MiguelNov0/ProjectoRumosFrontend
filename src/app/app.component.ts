import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ProjetoRumosWebApiServicesService } from './services/projeto-rumos-web-api-services.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private service:ProjetoRumosWebApiServicesService) { }
  
  ngOnInit(): void {
    //INICIALIZAR O SITE
    this.service.autoLogin();
    this.service.getAllRecipes();
    this.service.getAllCategories();
 

  }
  title = 'ProjectoRumosAngular';

  //Configuração do RichTextEditor
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter text in this rich text editor....',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'Quote',
        class: 'quoteClass',
      },
      {
        name: 'Title Heading',
        class: 'titleHead',
        tag: 'h1',
      },
    ],
  };

}
