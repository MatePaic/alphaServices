import { NgModule } from "@angular/core";

import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToolbarModule} from 'primeng/toolbar';

@NgModule({
  exports: [
    ButtonModule,
    CardModule,
    TableModule,
    ToggleButtonModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    InputNumberModule,
    RadioButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule
  ]
})
export class PrimeNgModule {}
