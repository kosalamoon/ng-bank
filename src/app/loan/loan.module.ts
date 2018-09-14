import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LoanComponent} from "./loan/loan.component";
import {ReactiveFormsModule} from "@angular/forms";
import {AlertModule, ModalModule} from "ngx-bootstrap";
import {SharedModule} from "../shared/shared.module";
import {LoanTypeService} from "./service/loan-type.service";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    SharedModule
  ],
  declarations: [LoanComponent],
  providers: [
    LoanTypeService
  ]
})
export class LoanModule {
}
