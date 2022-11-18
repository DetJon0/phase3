import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.css'],
})
export class PasswordModalComponent implements OnInit {
  passwordForm: FormGroup;

  // passMismatch = false;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, [
        Validators.required,
        // this.doPasswordsMismatch.bind(this),
      ]),
      confirmNewPassword: new FormControl(null, [
        Validators.required,
        // this.doPasswordsMismatch.bind(this),
      ]),
    });
  }

  doPasswordsMismatch(control: FormControl): { [s: string]: boolean } {
    if (this.passwordForm && this.passwordForm.get('newPassword') === control) {
      if (
        control.value &&
        control.value !== this.passwordForm.value.confirmNewPassword
      ) {
        // console.log(true);
        return { passMismatch: true };
      }
    }
    if (
      this.passwordForm &&
      this.passwordForm.get('confirmNewPassword') === control
    ) {
      if (
        control.value &&
        control.value !== this.passwordForm.value.newPassword
      ) {
        // console.log('poshte' + true);
        return { passMismatch: true };
      }
    }
    // if (
    //   this.passwordForm &&
    //   this.passwordForm.value &&
    //   this.passwordForm.value.newPassword !==
    //     this.passwordForm.value.confirmNewPassword
    // ) {
    //   return { passMismatch: true };
    // }
    return null;
  }

  doPasswordsMatch() {
    return (
      this.passwordForm.value.newPassword ===
      this.passwordForm.value.confirmNewPassword
    );
  }

  onSubmit() {
    // console.log(this.passwordForm);

    if (!this.doPasswordsMatch() || !this.passwordForm.valid) {
      this.passwordForm.markAllAsTouched();
      // this.passwordForm.controls['confirmNewPassword'].updateValueAndValidity();
      return;
    }
  }
}
