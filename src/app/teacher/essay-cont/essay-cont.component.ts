import { Component, ViewChild, EventEmitter ,ElementRef, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import {Student} from 'src/app/student.model'
import {Teacher} from 'src/app/teacher.model'
import { TeacherService } from 'src/app/service/teacher.service';

import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'; 
import {MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { Essay } from 'src/app/essay.model';



@Component({
  selector: 'app-essay-cont',
  templateUrl: './essay-cont.component.html',
  styleUrls: ['./essay-cont.component.css']
})
export class EssayContComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('table') table: MatTable<Element>;
  @Input() selectedProf:Essay;

  @Input() course_name:string;
  @Input() task_id:string;




  columnsToDisplay: string[] = ['id','id_studente','nome_studente','stato','timestamp','voto','storico'];
  profControl = new FormControl();
  filteredProf: Observable<Essay[]>;
 // private _essay_per_task;
  private _all_prof: Essay[];

/*filtering*/
  filterForm = new FormGroup({
    filtering_state: new FormControl()
});




  @Input() set essay_per_task( all_prof: Essay[]){
    this._all_prof = all_prof;
    //aggiungo nome e cognome per visualizzarli ( dal server arriva solo idStudente, lo aggiungo con un altra chiamata al service), a partire dall'id
    this._all_prof.forEach(student => {
      this.teacherService.getStudentById(student.idStudente)
      .subscribe( s=> student.nome_studente=s.name+" "+s.firstName)
      });
    this.dataSource = new MatTableDataSource<Essay>(this._all_prof);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    //this.selectedProf=null;

  }



  constructor(private teacherService: TeacherService) {

  }


  dataSource = new MatTableDataSource<Essay>();

  
  selection = new SelectionModel<Essay>(true, []);
  
  
  ngOnInit() { 
    this.filteredProf = this.profControl.valueChanges
    .pipe(
      startWith(''), 
      map(teacher => teacher ? this._filteredProf(teacher) : this._all_prof.slice())
  );


/*filtering per stato */
  this.dataSource.filterPredicate = (data: Essay, filter: string) => {
    if(filter=='all') return true;
    return data.stato == filter;
   };

  }

  applyFilter() {
    this.dataSource.filter = this.filtering_state;
  }




  selezione_profs() {
    let list: Essay[] = [];
    this.selection.selected.forEach(item => list.push(item));
    this.selection = new SelectionModel<Essay>(true, []);

  }


  private _filteredProf(value: string): Essay[] {
    const filterValue = value.toString().toLowerCase();
    //console.log(value);
    //console.log(this.students);
    return this._all_prof.filter(x => x.idStudente.toString().toLowerCase().indexOf(filterValue) === 0 || x.nome_studente.toString().toLowerCase().indexOf(filterValue) === 0); 
  }
  
  
  





  /** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this._all_prof.length;
  return numSelected == numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this._all_prof.forEach(row => this.selection.select(row));
}



get filtering_state() { 
  return this.filterForm.get('filtering_state').value;
}


}
