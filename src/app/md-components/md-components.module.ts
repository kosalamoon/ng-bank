import {NgModule} from "@angular/core";
import {
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSortModule,
  MatTableModule
} from "@angular/material";
import {RolePipe} from "./pipes/role.pipe";
import {UnderscorePipe} from "./pipes/underscore.pipe";
import {TimePipe} from "./pipes/time.pipe";

@NgModule({
  declarations: [
    RolePipe,
    UnderscorePipe,
    TimePipe
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    RolePipe,
    UnderscorePipe,
    TimePipe
  ]
})
export class MdComponentsModule { }
