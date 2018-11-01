import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {AlertModule, ModalModule} from "ngx-bootstrap";
import {SharedModule} from "../shared/shared.module";
import {LoanTypeService} from "./service/loan-type.service";
import {LoanApproveComponent} from './loan-approve/loan-approve.component';
import {LoanRequestComponent} from './loan-request/loan-request.component';
import {LoanDetailsComponent} from './loan-details/loan-details.component';
import {LoanStatusService} from "./service/loan-status.service";
import {ChartsModule} from "ng2-charts";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    ChartsModule,
    SharedModule,
  ],
  declarations: [LoanApproveComponent, LoanRequestComponent, LoanDetailsComponent],
  providers: [
    LoanTypeService,
    LoanStatusService,
  ]
})
export class LoanModule {
}
