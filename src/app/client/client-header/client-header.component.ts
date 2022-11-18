import { Component, OnDestroy, OnInit } from '@angular/core';
import { faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css'],
})
export class ClientHeaderComponent implements OnInit, OnDestroy {
  openCollapse = false;
  faRightFromBracket = faRightFromBracket; //logout icon
  faUser = faUser;

  userDataSub: Subscription;
  username: string;
  constructor(private authService: AuthService, private ngbModal: NgbModal) {}

  ngOnInit(): void {
    this.userDataSub = this.authService.user.subscribe((userData) => {
      if (userData) {
        this.username = userData.username;
      }
    });
  }

  onLogoutUser() {
    const confirmModalRef: NgbModalRef = this.ngbModal.open(
      ConfirmDialogComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );
    confirmModalRef.componentInstance.message = `Are you sure you want to log out ${this.username.toUpperCase()}`;
    confirmModalRef.result.then((choice) => {
      if (choice) {
        this.authService.logout();
      }
    });
  }

  ngOnDestroy() {
    this.userDataSub && this.userDataSub.unsubscribe();
  }
}
