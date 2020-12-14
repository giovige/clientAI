import { Component, ViewChild, ElementRef, OnInit, Output, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SelectControlValueAccessor } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import {Student} from 'src/app/student.model'
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import {FormControl} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { strict } from 'assert';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'; 
import {MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LoginDialogComponent } from './auth/login-dialog/login-dialog.component';
import { AuthService } from './auth/auth.service';
import {StudentService} from 'src/app/service/student.service'
import { Router, ActivatedRoute } from '@angular/router';
import { TeacherService } from './service/teacher.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RegistrationDialogComponent } from './auth/registration-dialog/registration-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit, OnDestroy{
  public course_list = true;
  courses = [];
  public tab_type = 0;  // professore o non loggato => 0   ; studente => 1
  
  id: string;
  role: string;   //ruolo user = {STUDENT, PROFESSOR}
  course_name: string;
  title = 'ai20-lab05';
  routeQueryParams$: Subscription;
  username: string;
  photo: any;

  teamPresent: boolean;
  teamId:string;

  menuAvailable : Observable<boolean>
  show_bar= false;

  @ViewChild('sidenav') sidenav: MatSidenav;


constructor(private teacherService:TeacherService,private sanitizer: DomSanitizer, public dialog: MatDialog, public authService: AuthService, private router: Router, private route: ActivatedRoute, private studentService: StudentService) {
  this.courses= [];
  this.id = null;
  this.role = null;
  this.course_name = null;
  this.routeQueryParams$ = route.queryParams.subscribe(params => {
    if (params['doLogin']) {
      this.openDialog_login();
      this.sidenav.close();
    }
	if (params['doRegistration']) {
      this.openDialog_registration();
      this.sidenav.close();

    }
  });
}

  ngOnInit() {
    this.authService.resetRole();
    this.tab_type=0;
    this.router.navigateByUrl('home');
  }

  


  toggleForMenuClick() {
    this.sidenav.toggle();
  }

//dialog login
  openDialog_login(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '250px'  
  });
    dialogRef.afterClosed().subscribe( end => {
		this.setRole();
		
      if(end=="ok" && this.role=='ROLE_PROFESSOR') {
        //mi sono loggato come professore
	    	this.tab_type=0;
        //this.username=localStorage.getItem('username');
         this.getID();
         this.getCoursesProf();
         this.getPhoto();
         setTimeout(() => {      //apro sidenav una volta che i corsi sono disponibili
          this.toggleForMenuClick();
          }, 200);
      }
      else if(end=="ok" && this.role=='ROLE_STUDENT') {
		    //mi sono loggato come studente
		    this.tab_type=1;
        this.getCoursesForStudent();
        //this.username=localStorage.getItem('username');
        this.getID();
        this.getPhoto();
        setTimeout(() => {      //apro sidenav una volta che i corsi sono disponibili
          this.toggleForMenuClick();
          }, 200);
      }

      this.router.navigateByUrl('home');
      /* setTimeout(() => {      //apro sidenav una volta che i corsi sono disponibili
          this.toggleForMenuClick();
          }, 200); */
    });
    
  }
  
  
  
    //dialog registration
  openDialog_registration(): void {
    const dialogRef = this.dialog.open(RegistrationDialogComponent, {
      height: '90%',
      width: '40%'
  });
    dialogRef.afterClosed().subscribe( end => {
       this.router.navigateByUrl('home');
       if(end=="ok") {
         setTimeout(() => {      //apro sidenav una volta che i corsi sono disponibili
          this.toggleForMenuClick();
          }, 200);
      }
      
    });
    
  }
  


    getCoursesProf(): void {
      this.teacherService.getCoursesByProf(this.id)
          .subscribe(s => {this.courses = s;console.log(this.courses);});
    }

    getPhoto(): void {
      if(this.authService.isProfessor())
      {
      this.teacherService.getProfessorById(this.id)
        .subscribe (s => {
          console.log(s);
          if(s.photoDocente==null || s.photoDocente=='')
          this.photo="/assets/standard_img.png";
          else {
          let objectURL = 'data:image/png;base64,' + s.photoDocente;
          //this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.photo = this.sanitizer.bypassSecurityTrustUrl(objectURL); }
        
        }); }

        if(this.authService.isStudent())
        {

          this.teacherService.getStudentById(this.id)
          .subscribe (s => {
            console.log(s);
            if(s.photoStudent==null || s.photoStudent==''){
            this.photo="/assets/standard_img.png";
            }else {
            let objectURL = 'data:image/png;base64,' + s.photoStudent;
            //this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this.photo = this.sanitizer.bypassSecurityTrustUrl(objectURL); }
          });
        }


    }

    public checkPhoto_prof() {
      if(this.photo==null) {
      return true; }
      else return false;
    }
    
  reload_courses() {

    this.teacherService.getCourses()
          .subscribe(s => {
            this.courses = s;
            this.course_list = false;
            setTimeout(() => this.course_list = true);
          });
    
  }

  reload_img() {
    this.getPhoto();
  }



  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/home');
	this.photo=null;
    this.sidenav.close();
    this.courses= [];
    this.id = null;
    this.role = null;
    this.course_name = null;
    this.tab_type=0;
    
  }

  ngOnDestroy() {
    this.routeQueryParams$.unsubscribe();
  }


  clicked_course(course_name:string) {
    if(course_name=='home' || course_name=="profile" || course_name=="new_course") 
      this.course_name=null;
    else
      this.course_name=course_name;

  }
  
  
  /*
  clicked_course(course_name:string) {
    if(course_name=='new_course') {
    this.course_name="Nuovo corso"; 
    this.show_bar=false; }
    else if(course_name=='home') {
    this.course_name="Home";
    this.show_bar=false; }
    else if(course_name=='profile') {
    this.course_name="Profile";
    this.show_bar=false; }
    else {
    this.course_name=course_name;
    this.show_bar=true; }
    //mostro la navbar Studenti,Consegne etc
    
    if (this.show_bar) {
    this.menuAvailable = new Observable(observer=>observer.next(this.show_bar));
    this.menuAvailable.subscribe();
  } else {

    this.menuAvailable = new Observable(observer=>observer.next(this.show_bar));
    this.menuAvailable.subscribe();   
}
    this.menuAvailable = new Observable(observer=>observer.next(this.show_bar));
  
  }
  */
  
  clicked_delete(name:string) : void {
    if(confirm("Are you sure to delete "+name)) {
      console.log("Implement delete functionality here");
    }
      this.teacherService.deleteCourse(name)
          .subscribe(s => console.log("asd"));
    }

	clicked_edit(course_name:string) : void {
    this.course_name=course_name;

	}

  getID(){
    this.id = this.authService.getUserId();
    console.log(this.id);
  }

  getCoursesForStudent(): void {
      this.getID();
      this.studentService.getStudentCourses(this.id)
          .subscribe(s => {this.courses = s;/*console.log(this.courses);*/});
  }


  getCourses(): void {
    this.studentService.getCourses()
        .subscribe(s => {this.courses = s;/*console.log(this.courses);*/});
  }

  setRole(): void {
    this.role = this.authService.getStudentRole();
    console.log(this.role);
  }


  
  groupClicked(course: string): void{
    //alert('AAAAAAAAAAAAAAAAAAHHHHH');
    this.studentService.getStudentTeamByCourse(this.id, course)
    .subscribe( g => {
      console.log('>>>>>>>>teamExist');
      if(g!==null) this.teamId = g.id;
      console.log(this.teamId);
      if(this.teamId!==undefined){
        this.teamPresent=true;
      }else
        this.teamPresent=false;
      console.log(this.teamPresent);
      this.router.navigateByUrl('student/courses/'+ course +'/groups');
    });

  }

}