import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherService } from 'src/app/service/teacher.service';
import { Task} from '../../task.model';
import { Essay} from '../../essay.model';
import { Student} from '../../student.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  panelOpenState = false;
  course_name: string;
  tasks: Task[];
  thumbnail: any;
  essay_per_task  : Map<Task, Essay[]> = new Map<Task, Essay[]>();
  students: Student[];

  constructor(private sanitizer: DomSanitizer,private teacherService: TeacherService,private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
      this.activatedRoute.params.subscribe(p => {
        this.course_name = p['course_name'];
        } )
        this.getTasks();
  } 
  toArray(answers: object) {
    return Object.keys(answers).map(key => answers[key])
  }

  orderingTaskbyDataScadenza() {
  //rimuovo tutto da essay per task
    this.essay_per_task.clear();
    //ordino i task
    const descending: any= this.tasks.sort((a,b) => (a > b ? -1 : 1))
    //richiamo la getEssayByTask
    this.getEssaysByTask(this.tasks); 
  }

  orderingTaskbyDataRilascio() {
    //rimuovo tutto da essay per task
    this.essay_per_task.clear();
    //ordino i task
    const ascending: any= this.tasks.sort((a,b) =>  (a.dataScadenza > b.dataScadenza ? 1 : -1));
    //richiamo la getEssayByTask
    this.getEssaysByTask(this.tasks); 
  }



  getTasks(): void {
    this.teacherService.getTaskByCourse(this.course_name)
        .subscribe( s => {
          console.log(s);
          s.forEach(x => { 

            //var bytes = x.description;
            //var uints = new Uint8Array(bytes);
            //var base64 = btoa(String.fromCharCode(null,bytes));
           // var url = 'data:image/jpeg;base64,' + base64; // use this in <img src="..."> binding

           //sanitize immagine, la salvo "pulita" cosi poi devo solo visualizzarla senza fare altro
            let objectURL = 'data:image/png;base64,' + x.description;
            x.description = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        
          })
          this.tasks=s;

          //ordino a livello temporale, in questo caso per DataRilascio
          this.orderingTaskbyDataRilascio();

          //prendo gli essays per ogni task
          this.getEssaysByTask(this.tasks); 
        });

  }

  getEssaysByTask(tasks: Task[]): void {
    this.tasks.forEach(task => { 
      this.teacherService.getEssays(this.course_name,task.id)
      .subscribe( essay => {
        essay.forEach(es => {
          if(es.stato==null) es.stato="Non ancora letto";
        });
        this.essay_per_task.set(task,essay); 
        console.log(this.essay_per_task)});
    
    } );

}  

}
