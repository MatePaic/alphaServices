import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../authService.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  sigunUpFormGroup!: FormGroup;
  isSubmitted = false;
  authError = false;
  authMessage = 'Email is already used';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._initSignupForm();
  }

  get signUpForm() {
    return this.sigunUpFormGroup.controls;
  }

  private _initSignupForm() {
    this.sigunUpFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public goLogin() {
    this.router.navigate(['/login']);
  }

  public onSignup() {
    this.isSubmitted = true;
    if (this.sigunUpFormGroup.invalid) {
      return;
    }
    // this.authService.createUser(this.signUpForm['email'].value, this.signUpForm['password'].value);

    this.authService.createUser(this.signUpForm['email'].value, this.signUpForm['password'].value)
      .subscribe((user) => {
        this.authError = false;
        this.router.navigate(['/login']);
      }, (error) => {
        this.authError = true;
        console.log(error);
        if (error.status !== 400) {
          this.authMessage = "Error in the Server, please try again later!";
        }
      }
    );
  }
}
