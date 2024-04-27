import { AuthService } from './../../services/concretes/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserForLoginRequest } from '../../models/requests/users/user-for-login-request';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
  export class LoginComponent {

loginForm!:FormGroup
    constructor(private formBuilder:FormBuilder,private authService:AuthService,private router:Router){}
  
    ngOnInit(): void {
      this.createLoginForm();
    }
  
    createLoginForm(){
      this.loginForm=this.formBuilder.group({
        email:["",Validators.required],
        password:["",Validators.required]
      })
    }
  
    login(){
      if(this.loginForm.valid){
        let loginModel:UserForLoginRequest = Object.assign({},this.loginForm.value);
        this.authService.login(loginModel).subscribe(response=>{
          this.router.navigate(['homepage'])
        }
        ,(error:any)=>{
          alert(error.error)
        })
      }
    }

}

