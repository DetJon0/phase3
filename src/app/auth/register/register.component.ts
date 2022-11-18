import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUser } from 'src/app/shared/models/user.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup;
  isLoading = false;
  errorMsg:string = null;
  isError:boolean;

  constructor(private router:Router, private authService:AuthService){}

  ngOnInit(){
      this.registerForm = new FormGroup({

        'username' : new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z]{3,}')]),
        'firstName' : new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z]{3,}')]),
        'lastName' : new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z]{3,}')]),
        'email' : new FormControl(null, [Validators.required,Validators.email]),
        'password' : new FormControl(null, [Validators.required]),
        'phoneNumber': new FormControl(null, [Validators.required, Validators.pattern('^\\+?[0-9]{10,12}$')])
      })
  }

  onSubmit(){
      // console.log(this.registerForm);

      if(!this.registerForm.valid){
        this.registerForm.markAllAsTouched();
        return ;
      }

      const newUser : RegisterUser = {

        username : this.registerForm.value.username,
        firstName : this.registerForm.value.firstName,
        lastName : this.registerForm.value.lastName,
        email : this.registerForm.value.email,
        password : this.registerForm.value.password,
        phoneNumber : this.registerForm.value.phoneNumber,

      }

      this.isLoading = true;

      this.authService.singup(newUser).subscribe({
        next : (data)=>{
            this.isLoading = false;
            this.isError = false;
            this.errorMsg = 'You have been registered successfully';
            setTimeout(()=>{
              this.router.navigate(['/login']);
            },700)

        },
        error : (errorMsg)=>{
            this.isLoading = false;
            this.isError = true;
            this.errorMsg = errorMsg;

        }
    });
  }

  reset(){
      this.registerForm.reset();
  }

}
