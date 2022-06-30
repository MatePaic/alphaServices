import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogoComponent } from './shared/logo/logo.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { OrdersFormComponent } from './orders/orders-form/orders-form.component';
import { SignupComponent } from './users/signup/signup.component';
import { LoginComponent } from './users/login/login.component';
import { PrimeNgModule } from './primeNg.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyOrdersComponent } from './orders/shared/my-orders/my-orders.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedComponent } from './users/shared/shared.component';
import { Jwtinterceptor } from './users/jwt.interceptor';
import { ResetPasswordEmailComponent } from './users/reset-password-email/reset-password-email.component';
import { ResetPasswordEnterPasswordsComponent } from './users/reset-password-enter-passwords/reset-password-enter-passwords.component';

@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    OrdersListComponent,
    OrdersFormComponent,
    SignupComponent,
    LoginComponent,
    MyOrdersComponent,
    SharedComponent,
    ResetPasswordEmailComponent,
    ResetPasswordEnterPasswordsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: Jwtinterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
