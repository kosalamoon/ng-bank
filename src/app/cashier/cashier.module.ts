import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AlertModule, ModalModule} from "ngx-bootstrap";
import {SharesAccountComponent} from "./shares-account/shares-account.component";
import {TeamAccountComponent} from "./team-account/team-account.component";
import {DepositComponent} from "./deposit/deposit.component";
import {WithdrawComponent} from "./withdraw/withdraw.component";
import {LoanInstallmentComponent} from "./loan-installment/loan-installment.component";
import {LoanService} from "../loan/service/loan.service";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot()
  ],
  declarations: [
    SharesAccountComponent,
    TeamAccountComponent,
    DepositComponent,
    WithdrawComponent,
    LoanInstallmentComponent
  ],
  providers: [
    LoanService
  ]
})
export class CashierModule {
}
