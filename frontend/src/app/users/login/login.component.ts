import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../authService.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  isSubmitted = false;
  authError = false;
  authMessage = 'Email or Password are wrong';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._initLoginForm();
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }

  private _initLoginForm() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public resetPassword() {
    this.router.navigate(['/reset']);
  }

  public goSignup() {
    this.router.navigate(['/signup']);
  }

  public onLoginIn() {
    this.isSubmitted = true;
    if (this.loginFormGroup.invalid) return;

    this.authService.login(this.loginForm['email'].value, this.loginForm['password'].value)
      .subscribe((user) => {
        this.authError = false;
        this.localStorageService.setToken(user.token);
        this.router.navigate(['/orders']);
      }, (error) => {
        this.authError = true;
        if (error.status !== 400) {
          this.authMessage = "Error in the Server, please try again later!";
        }
      }
    );
  }
}
