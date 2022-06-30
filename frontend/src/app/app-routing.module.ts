import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersFormComponent } from './orders/orders-form/orders-form.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { AuthGuard } from './users/auth-guard.service';
import { LoginComponent } from './users/login/login.component';
import { ResetPasswordEmailComponent } from './users/reset-password-email/reset-password-email.component';
import { ResetPasswordEnterPasswordsComponent } from './users/reset-password-enter-passwords/reset-password-enter-passwords.component';
import { SignupComponent } from './users/signup/signup.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrdersListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/form',
    component: OrdersFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/form/:id',
    component: OrdersFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'reset-password-email',
    component: ResetPasswordEmailComponent
  },
  {
    path: 'reset-password-enter-passwords',
    component: ResetPasswordEnterPasswordsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
