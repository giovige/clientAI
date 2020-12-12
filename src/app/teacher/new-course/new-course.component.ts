import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Course } from 'src/app/course.model';
import { Teacher } from 'src/app/teacher.model';
import { TeacherService } from 'src/app/service/teacher.service';
import { AppComponent } from 'src/app/app.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationComponent } from 'src/app/teacher/notification/notification.component';


@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.css']
})
export class NewCourseComponent implements OnInit {
  model = new Course();
  all_prof: Teacher[];
  selected_prof: Teacher[];


  constructor(private dialog: MatDialog,private teacherService:TeacherService, private appComponent: AppComponent) { 
    this.all_prof=[];
  }

  ngOnInit(): void {
    this.getAll();

  }

  onSubmit() { 
    let id_owners: string[] = [];

    this.selected_prof.forEach(item => id_owners.push(item.id));

    this.teacherService.create_course(id_owners,this.model)
    .subscribe(s => { 
        console.log(s);
        if(s)
        this.openDialog_notification_confirm("Corso creato con successo!");
        else
        this.openDialog_notification_confirm("Si è verificato un problema...");
        this.appComponent.reload_courses();
    },
    err => this.openDialog_notification_confirm("Si è verificato un errore.")

    );
  }

  openDialog_notification_confirm(msg: string): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      height: '20%',
      width: '20%',
      data: {
        text: msg
      }
  }); }

  getAll(): void {
    this.teacherService.getAllProfessors()
    .subscribe(s => { this.all_prof = s;});
  }

/*  create_course(): void {
    let id_owners: string[] = [];

    this.selected_prof.forEach(item => id_owners.push(item.id));

    this.teacherService.create_course(id_owners,this.model)
    .subscribe(s => { 
        console.log(s);



    });
  }

  */

  
scelta_professori(profs: Teacher[]): void {
  this.selected_prof=profs;
  console.log(this.selected_prof);
}

  
}
