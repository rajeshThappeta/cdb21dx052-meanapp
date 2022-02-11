import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup,Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

 
  
  userLoginForm:FormGroup;

  registrationError={
    error:false,
    errorMessage:''
  }

  constructor(private fb:FormBuilder,private router:Router,private userService:UserService) { }

  ngOnInit(): void {


    this.userLoginForm=this.fb.group({       
        username:['',Validators.required],
        password:['',Validators.required],
      
    })
  }

  //write getters
  get username(){
    return this.userLoginForm.get('username')
  }
  get password(){
    return this.userLoginForm.get('password')
  }


  onFormSubmit(){
   
    this.userService.loginUser(this.userLoginForm.value).subscribe({
      next:(res)=>{

       
        //if credentials are invalid
          if(res.message!=='login success'){

            this.registrationError.error=true;
            this.registrationError.errorMessage=res.message
           
          }
          //when creadentials are correct
          else{ 

         
            //store token in local storage 
            localStorage.setItem("token",res.token)
            //update userBehaviourSubject with userObj
            this.userService.getUserBehaviousSubject().next(res.user)
            //navigate to user profile   
            this.router.navigateByUrl(`userprofile/${res.user.username}`)   
            
          }
      },
      error:(err)=>{
        console.log(err)
        alert("Something went wrong")
      }
    })
  }



}
