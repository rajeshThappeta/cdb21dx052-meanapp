import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userBehaviourSubject=new BehaviorSubject(null)



  constructor(private hclient:HttpClient) { }

  getUserBehaviousSubject(){
    return this.userBehaviourSubject;
  }

  

  //user register
  registerUser(userObj):Observable<any>{
    return this.hclient.post("http://localhost:5000/user/createuser",userObj)
  }

  //user login
  loginUser(userCredObj):Observable<any>{
    return this.hclient.post("http://localhost:5000/user/login",userCredObj)
  }

  //user logout
  userLogout(){
    //remove token
    localStorage.removeItem("token")
    //clear user behaviour subject
    this.getUserBehaviousSubject().next(null)
  }


  //add task
  addTask(newTask):Observable<any>{
    return this.hclient.post("http://localhost:5000/user/addtask",newTask)
  }
}
