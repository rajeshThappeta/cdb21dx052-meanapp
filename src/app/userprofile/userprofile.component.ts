import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {

  userObj;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.userObj=this.userService.getUserBehaviousSubject().getValue()
  }

}
