import { Component, OnInit ,TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup,Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { UserService } from '../user.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  userSignupForm:FormGroup;

  registrationError={
    error:false,
    errorMessage:''
  }

  constructor(private fb:FormBuilder,private router:Router,private userService:UserService,private modalService: BsModalService) { }

  ngOnInit(): void {


    this.userSignupForm=this.fb.group({       
        username:['',Validators.required],
        password:['',Validators.required],
        email:['',Validators.required],
        city:['',Validators.required],
      //sign  file:['']
    })
  }

  //write getters
  get username(){
    return this.userSignupForm.get('username')
  }
  get password(){
    return this.userSignupForm.get('password')
  }
  get email(){
    return this.userSignupForm.get('email')
  }
  get city(){
    return this.userSignupForm.get('city')
  }

  fileName:string;
  file:File;
  imageUrl:string | ArrayBuffer="https://bulma.io/images/placeholders/480x480.png"



  

  onFileSelected(file:File){
    
    this.file=file;
    this.fileName=file.name;

    //read file content to preview
    const reader=new FileReader()
    reader.readAsDataURL(file)

    reader.onload=()=>{
        this.imageUrl=reader.result;
    }

  }



  onFormSubmit(template: TemplateRef<any>){

    //add userObj and profile photo image
    let formData=new FormData();

    //get userObj
    let userObj=this.userSignupForm.value;

    //add userObj to formData
    formData.append("userObj",JSON.stringify(userObj))
    //add image to formData
    formData.append("photo",this.file)
   
    this.userService.registerUser(formData).subscribe({
      next:(res)=>{
          if(res.message==='User already existed'){

            this.registrationError.error=true;
            this.registrationError.errorMessage=res.message
           // alert("Username has already taken")
          }
          //when user registration is success
          else{  
            //invoke modal        
            this.openModal(template)           
          }
      },
      error:(err)=>{
        console.log(err)
        alert("Something went wrong")
      }
    })
  }



  //modal
  modalRef?: BsModalRef;
  
  

 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.router.navigateByUrl("/login")
    this.modalRef?.hide();
  }
 
  decline(): void {
   this.router.navigateByUrl("/home")
    this.modalRef?.hide();
  }

}
