import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ErrorComponent } from './error/error.component';
import { LoadingComponent } from './loading/loading.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DisplayAmenitiesPipe } from './display-amenities.pipe';

export enum AmenitiesEnum {
  Parking,
  FreeWifi,
  Pool,
  Fitness,
  Security,
  Elevators,
  Terrace,
}

@NgModule({
  declarations: [
    ErrorComponent,
    LoadingComponent,
    ConfirmDialogComponent,
    DisplayAmenitiesPipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ErrorComponent,
    LoadingComponent,
    ConfirmDialogComponent,
    FontAwesomeModule,
    DisplayAmenitiesPipe,
  ],
})
export class SharedModule {}
