import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from '../../user.model';
import { User_registration } from '../../user_registration.model';
import { NotificationComponent } from 'src/app/teacher/notification/notification.component';
import { LoadingDialogComponent } from 'src/app/teacher/notification/loading-dialog.component';
import { validateHorizontalPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent implements OnInit {

  userDTO : User_registration = new User_registration("","","","","","");
  email = new FormControl('', [Validators.required]);
  nome = new FormControl('', [Validators.required]);
  cognome = new FormControl('', [Validators.required]);
  matricola = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  myError='';
  form: FormGroup;
  user: User;
  getErrorEmailMessage() {
        if(this.email.hasError('required')){
          return 'Not a valid email';
        }
    }
  
  getErrorPasswordMessage(){
    if(this.password.hasError('required')){
      return 'Not a valid password';
    }
  }

  getErrorNomeMessage() {
    if(this.nome.hasError('required')){
      return 'Not a valid name';
    }
}
getErrorMatricolaMessage() {
  if(this.matricola.hasError('required')){
    return 'Not a valid matricola';
  }
}
getErrorCognomeMessage() {
  if(this.cognome.hasError('required')){
    return 'Not a valid surname';
  }
}

  

  constructor(public dialog: MatDialog,private fb: FormBuilder, private authservice: AuthService, public dialogRef: MatDialogRef<RegistrationDialogComponent>) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      matricola: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      role: ['', Validators.required]

    });
    
    
  }

  ngOnInit(): void {
  }

  
  registration() {
    const val = this.form.value;
    console.log(val.role);
    if(!this.form.invalid) {
      let check_email = val.email.split("@");
      if((val.role=="ROLE_STUDENT" && check_email[1]=="studenti.polito.it") || 
       (val.role=="ROLE_PROFESSOR" && check_email[1]=="polito.it") ) 
       //selezionato ed inserito email coerente al ruolo
       {
      this.userDTO.username=val.matricola;
      this.userDTO.password=val.password;
      this.userDTO.role=val.role;
      this.userDTO.email=val.email;
      this.userDTO.nome=val.nome;
      this.userDTO.cognome=val.cognome;
      console.log(this.userDTO);
      this.openDialog_loading("Invio della richiesta in corso...Rimani in attesa.");
      this.authservice.registration(this.userDTO)
          .subscribe( 
            data => { 
              this.dialogRef.close("ok");
              this.dialog.closeAll();
              this.openDialog_notification_confirm("E'stata mandata una mail a "+this.userDTO.email+" con il link per confermare la creazione dell'account."); },
            error => {
              this.dialog.closeAll();
              this.openDialog_notification_confirm("Si è verificato un errore: lo username è già registrato nel sistema.");
              this.myError='Registration error!'}
          );
    } 
  else this.myError="Email e ruolo non compatibili"; }
    else this.myError="Invalid form";
  }

  openDialog_notification_confirm(msg:string): void {
      const dialogRef = this.dialog.open(NotificationComponent, {
        width: '400px',
        height: '250px',
        data: {
          text : msg
        }
    });
     
  }

  openDialog_loading(msg:string): void {
    const dialogRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
      width: '350px',
      height: '400px',
      data: {
        text : msg
      }
  });
  }
 /* logout() {
    console.log("logout in LoginDialogComponent");
    this.authservice.logout();
  }*/


}
