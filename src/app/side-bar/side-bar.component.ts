import { Component, OnInit } from '@angular/core';
import {
  faHouse,
  faBuildingUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  faHouse = faHouse;
  faBuildingUser = faBuildingUser;
  faUsers = faUsers;

  constructor() {}

  ngOnInit(): void {}
}
