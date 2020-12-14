import {Component, Inject, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {Team} from '../../team.model';
import { TeacherService } from 'src/app/service/teacher.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationComponent } from 'src/app/teacher/notification/notification.component';

@Component({
  selector: 'app-group-dialog-info',
  templateUrl: './group-dialog-info.component.html',
  styleUrls: ['./group-dialog-info.component.css']
})
export class GroupDialogInfoComponent implements OnInit {


  form: FormGroup;
  coidValue: string = '';
  conameValue: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,public dialogRef: MatDialogRef<GroupDialogInfoComponent>,private teacherService:TeacherService) { }
  team: Team = this.data.team_selected;

  ngOnInit(): void {
    alert(this.data.team_selected.gbramTot);
    this.form = new FormGroup({
      'gbramtotali': new FormControl(this.data.team_selected.gbramTot,[]),
      'gbramusati': new FormControl(this.data.team_selected.gbramUsati,[]),
      'gbdisktotali': new FormControl(this.data.team_selected.gbdiskTot,[]),
      'gbdiskusati': new FormControl(this.data.team_selected.gbdiskUsati,[]),
      'vmaccese': new FormControl(this.data.team_selected.vmAccese,[]),
      'maxvmaccese': new FormControl(this.data.team_selected.maxVmAccese,[]),
      'status': new FormControl(this.data.team_selected.status,[]),
      'vcputotali': new FormControl(this.data.team_selected.vcpuTot,[]),
      'vcpuusate': new FormControl(this.data.team_selected.vcpuUsati,[])
    });
  }

  onSubmit() {

    this.teacherService.changeLimitVmGroup(this.vcpuTot,this.gbDiskTot,this.gbRamTot,this.maxVmAccese,this.data.course,this.data.team_selected.id)
    .subscribe(s => {
      this.openDialog_notification_confirm("Limiti aggiornati.");
      this.dialogRef.close("refresh");
    },
               err => {
                 console.log(err);
                 this.openDialog_notification_confirm("Impossibile completare l'operazione");
                 this.dialogRef.close("err");

                } ) 

  }

  openDialog_notification_confirm(msg: string): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
      height: '250px',
      data: {
        text: msg
      }
  }); }


  get gbRamTot() { return this.form.get('gbramtotali').value; }
  get gbRamUsati() { return this.form.get('gbramusati').value; }
  get gbDiskTot() { return this.form.get('gbdisktotali').value; }
  get gbDiskUsati() { return this.form.get('gbdiskusati').value; }
  get vmAccese() { return this.form.get('vmaccese').value; }
  get maxVmAccese() { return this.form.get('maxvmaccese').value; }
  get status() { return this.form.get('status').value; }
  get vcpuTot() { return this.form.get('vcputotali').value; }
  get vcpuUsate() { return this.form.get('vcpuusate').value; }


}
