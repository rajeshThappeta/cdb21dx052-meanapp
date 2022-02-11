import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
   
     //get token from local storage
     let token=localStorage.getItem("token")
     //if  token found
     if(token){
       //add token to header of req object
     const clonedReq=  req.clone({
         headers:req.headers.set("Authorization","Bearer "+token)
       })
       //forward to next interceptor/api
       return next.handle(clonedReq)
     }
    
     //if no token found
     else{
       //forward req object as it is
       return next.handle(req)
     }

  }
}
