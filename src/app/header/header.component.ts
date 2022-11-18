import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

import { AuthService } from '../auth/auth.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSub : Subscription;
  username:string;
  role:string;

  faRightFromBracket = faRightFromBracket; //logout icon

  constructor(private authService:AuthService, private ngbModal:NgbModal) { }

  ngOnInit(): void {

    this.userSub = this.authService.user.subscribe(user=>{
      if(user){
        this.username = user.username;
        this.role = user.role;
      }
    });

  }

  onLogout(){
    const confirmModalRef : NgbModalRef = this.ngbModal.open(ConfirmDialogComponent, {
      centered: true,
      backdrop: 'static',
    })
    confirmModalRef.componentInstance.message = "Are you sure you want to logOut " + this.username;
    confirmModalRef.result.then(choice=>{
      if(choice){
        this.authService.logout();
      }
    })
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
