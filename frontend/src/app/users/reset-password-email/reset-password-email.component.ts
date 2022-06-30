import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../authService.service';
import { IResponse } from '../response.model';

@Component({
  selector: 'app-reset-password-email',
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.css'],
})
export class ResetPasswordEmailComponent implements OnInit {
  resetFormGroup!: FormGroup;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this._initLoginForm();
  }

  get resetForm() {
    return this.resetFormGroup.controls;
  }

  private _initLoginForm() {
    this.resetFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  private _sendEmail(email: string): void {
    this.authService.sendEmailForResetPassword(email).subscribe(
      (response: IResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'An email containing the password reset link was sent!'
        });
      }, (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: JSON.stringify(err)
        });
      }

    )
  }

  public onSubmit() {
    this.isSubmitted = true;
    if (this.resetFormGroup.invalid) {
      return;
    }

    this._sendEmail(this.resetForm['email'].value);
  }
}
