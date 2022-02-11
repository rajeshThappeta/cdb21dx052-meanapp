import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent implements OnInit {


  addTaskForm:FormGroup;

  registrationError={
    error:false,
    errorMessage:''
  }

  constructor(private fb:FormBuilder,private router:Router,private userService:UserService) { }

  ngOnInit(): void {


    this.addTaskForm=this.fb.group({       
        nameOfTask:['',Validators.required],
        date:['',Validators.required],
        description:['',Validators.required],
        
    })
  }

  //write getters
  get nameOfTask(){
    return this.addTaskForm.get('nameOfTask')
  }
  get date(){
    return this.addTaskForm.get('date')
  }
  get description(){
    return this.addTaskForm.get('description')
  }



  onFormSubmit(){
      
   this.userService.addTask(this.addTaskForm.value).subscribe({
     next:(res)=>{
       console.log("res is ",res)
     },
     error:(err)=>{
       console.log("err is ",err)
     }
   })
  }


}
