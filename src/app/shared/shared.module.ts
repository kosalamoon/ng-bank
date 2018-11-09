import {NgModule} from "@angular/core";
import {
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
} from "@angular/material";
import {RolePipe} from "./pipes/role.pipe";
import {UnderscorePipe} from "./pipes/underscore.pipe";
import {TimePipe} from "./pipes/time.pipe";
import {SentenceCasePipe} from "./pipes/sentence-case.pipe";
import {CdkTableModule} from "@angular/cdk/table";
import {ExportService} from "./print/export.service";

@NgModule({
  declarations: [
    RolePipe,
    UnderscorePipe,
    TimePipe,
    SentenceCasePipe
  ],
  exports: [
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    RolePipe,
    UnderscorePipe,
    TimePipe,
    SentenceCasePipe
  ],
  providers: [ExportService],
})
export class SharedModule { }
