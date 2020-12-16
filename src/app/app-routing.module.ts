import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { VmsContComponentComponent } from './student/vms/vms-cont-component.component';
import { PageNotFoundComponentComponent } from './page-not-found-component.component';
import { AuthGuard } from './auth/auth.guard';
import { GroupsContComponent} from './student/groups/groups-cont.component';
import { TaskContComponent } from './student/tasks/task-cont.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './teacher/profile/profile.component';
import { NewTaskComponent } from './teacher/new-task/new-task.component';
import { EssayHandleComponent } from './teacher/essay-handle/essay-handle.component';
import { UpdateCourseComponent } from './teacher/update-course/update-course.component';
import { VmsComponent } from './teacher/vms/vms.component';
import { VmsLinkComponent } from './teacher/vms/vms-link/vms-link.component';
import { TaskComponent } from './teacher/task/task.component';
import { NewCourseComponent } from './teacher/new-course/new-course.component';
import { StudentsContComponent } from './teacher/students/students-cont.component';
import { TeacherTaskManageComponent } from './teacher/teacher-task-manage/teacher-task-manage.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'courses',  redirectTo: 'teacher/courses'},
  { path: 'teacher/courses/:course_name/enrolled', canActivate: [AuthGuard], component: StudentsContComponent },
  { path: ':user/profile', canActivate: [AuthGuard], component: ProfileComponent },
  { path: 'teacher/courses/:course_name/new_task', canActivate: [AuthGuard], component: NewTaskComponent },
  { path: 'teacher/courses/:course_name/task/:task_id', canActivate: [AuthGuard], component: TeacherTaskManageComponent},
  { path: 'teacher/courses/:course_name/task/:task_id/essay/:essay_id/manage_essay', canActivate: [AuthGuard], component: EssayHandleComponent},
  { path: 'teacher/courses/:course_name/update', canActivate: [AuthGuard], component: UpdateCourseComponent },
  { path: 'teacher/courses/:course_name/vms', canActivate: [AuthGuard], component: VmsComponent },
  { path: 'teacher/courses/:course_name/vms/:vm', canActivate: [AuthGuard], component: VmsLinkComponent },
  { path: 'teacher/courses/:course_name/task', canActivate: [AuthGuard], component: TaskComponent },
  { path: 'teacher/courses/new_course', canActivate: [AuthGuard], component: NewCourseComponent } ,
  { path: 'student/courses/:course_name/students', canActivate: [AuthGuard], component: PageNotFoundComponentComponent },
  { path: 'student/courses/:course_name/vms', canActivate: [AuthGuard], component: VmsContComponentComponent },
  { path: 'student/courses/:course_name/groups', canActivate: [AuthGuard], component: GroupsContComponent },
  { path: 'student/courses/:course_name/tasks', canActivate: [AuthGuard], component: TaskContComponent },
  { path: '**', component: PageNotFoundComponentComponent }  
];


@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes, {enableTracing: false} )],
  exports: [RouterModule]
})
export class AppRoutingModule { }