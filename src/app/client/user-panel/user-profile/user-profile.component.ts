import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { User } from 'src/app/auth/user.model';
import { UserData, UserDataResponse } from 'src/app/shared/models/user.model';
import { UserService } from '../../user.service';
import { PasswordModalComponent } from './password-modal/password-modal.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userData: UserDataResponse;
  userProfileSub: Subscription;

  editForm: FormGroup;
  isEditMode = false;
  // 0-username, 1-name, 2-lastname, 3-email, 4-tel
  editArray = [false, false, false, false, false];

  faXmark = faXmark;

  constructor(
    private userService: UserService,
    private ngbModal: NgbModal,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.userProfileSub = this.userService.userProfileData.subscribe(
      (userProfileData) => {
        if (userProfileData) {
          this.userData = userProfileData;

          this.editForm = new FormGroup({
            userName: new FormControl(this.userData.userName, [
              Validators.required,
              Validators.pattern('[a-zA-Z]{3,}'),
            ]),
            firstName: new FormControl(this.userData.firstName, [
              Validators.required,
              Validators.pattern('[a-zA-Z]{3,}'),
            ]),
            lastName: new FormControl(this.userData.lastName, [
              Validators.required,
              Validators.pattern('[a-zA-Z]{3,}'),
            ]),
            // email: new FormControl(this.userData.email, [
            //   Validators.required,
            //   Validators.email,
            // ]),
            phoneNumber: new FormControl(this.userData.phoneNumber, [
              Validators.required,
              Validators.pattern('^\\+?[0-9]{10,12}$'),
            ]),
          });
          // console.log(this.editForm);
        }
      }
    );
  }

  onShowFormInput(index: number) {
    // hap modalen e registrimit...
    // this.ngbModal.open(RegisterComponent, {});
    if (this.editArray.includes(true)) return;

    this.editArray[index] = true;
  }
  onHideFormInput(index: number) {
    // hap modalen e registrimit...
    // this.ngbModal.open(RegisterComponent, {});
    if (index === -1) {
      this.editArray[this.editArray.indexOf(true)] = false;
      return;
    }
    this.editArray[index] = false; //u mbyll pa u bo save
    this.setFormValue(this.userData);
  }
  onSubmit() {
    // console.log(this.userData);

    if (!this.editForm.valid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const editUser: UserDataResponse = {
      ...this.userData,
      ...this.editForm.value,
    };
    // console.log(editUser);
    this.userService.editUser(editUser).subscribe({
      next: (data) => {
        // this.userData = data;
        this.setFormValue(data);
        this.userService.userProfileData.next(data);

        const token = JSON.parse(localStorage.getItem('activeUser')).token;
        const editUser = new User(
          data.userName,
          data.email,
          data.role,
          token,
          data.id
        );

        this.auth.user.next(editUser);
        localStorage.setItem('activeUser', JSON.stringify(editUser));

        this.onHideFormInput(-1);
      },
      error: (error) => {
        //afishimi i errorit
        this.setFormValue(this.userData);
        this.onHideFormInput(-1);
      },
    });
  }

  private setFormValue(data: UserDataResponse) {
    this.editForm.setValue({
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      // email: data.email,
      phoneNumber: data.phoneNumber,
    });
  }

  onPasswordModal() {
    this.ngbModal.open(PasswordModalComponent, {});
  }

  ngOnDestroy(): void {
    this.userProfileSub && this.userProfileSub.unsubscribe();
  }
}
