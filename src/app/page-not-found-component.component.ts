import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-not-found-component',
  template: `
    <div style="text-align: center;"> 
    <h1>
    <br>Benvenuto Studente!<br>
    Questa è la pagina del corso.
    </h1>
    <h3>Seleziona una tab per accedere alle informazioni del corso selezionato.</h3>
    </div>
    
  `,
  styles: [
  ]
})
export class PageNotFoundComponentComponent implements OnInit {

  coursename: string;

  
  constructor(private activatedRoute: ActivatedRoute) { 
  }

  ngOnInit(): void {
    
  }

}
