import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../authService.service';
import { IResponse } from '../response.model';

@Component({
  selector: 'app-reset-password-enter-passwords',
  templateUrl: './reset-password-enter-passwords.component.html',
  styleUrls: ['./reset-password-enter-passwords.component.css']
})
export class ResetPasswordEnterPasswordsComponent implements OnInit {
  token!: string;
  resetFormGroup!: FormGroup;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        this.token = params['token'];
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Reset token is neccessary to modifiy a password'
        });
      }
    });
    this._initLoginForm();
  }

  get resetForm() {
    return this.resetFormGroup.controls;
  }

  private _initLoginForm() {
    this.resetFormGroup = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  private _setPassword(token: string, password: string): void {
    this.authService.setPasswordForResetPassword(token, password).subscribe(
      (response: IResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Your password was reset!'
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      }, (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: JSON.stringify(err)
        });
      }
    );
  }

  public onSubmit() {
    this.isSubmitted = true;
    if (this.resetFormGroup.invalid) {
      return;
    } else if (this.resetForm['password'].value !== this.resetForm['confirmPassword'].value) {
      (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The password and confirm password need to be the same!'
        });
      }
    }
    this._setPassword(this.token, this.resetForm['password'].value);
  }
}
