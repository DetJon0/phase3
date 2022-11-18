import { Component, OnInit } from '@angular/core';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../client/user.service';
import { UserData } from '../shared/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  faInfo = faCircleInfo;

  users: UserData[];
  filteredUsers: UserData[];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.filteredUsers = users;
    });
  }
  onSearchUsers(event: InputEvent) {
    this.filteredUsers = this.users.filter((user) => {
      const searchVal = event.target['value'];
      return (
        user.email.toLowerCase().includes(searchVal.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchVal.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchVal.toLowerCase()) ||
        user.phoneNumber.toLowerCase().includes(searchVal.toLowerCase()) ||
        user.username.toLowerCase().includes(searchVal.toLowerCase())
      );
    });
  }
}
