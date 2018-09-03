import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AccountService} from "./service/account.service";
import {AccountTypeService} from "./service/account-type.service";
import {SubAccountTypeService} from "./service/sub-account-type.service";
import {AccountComponent} from "./account/account.component";
import {SharedModule} from "../shared/shared.module";
import {OperationTypeService} from "./service/operation-type.service";
import {ReactiveFormsModule} from "@angular/forms";
import {AlertModule, ModalModule} from "ngx-bootstrap";
import {EntryService} from "./service/entry.service";
import {TransactionService} from "./service/transaction.service";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    SharedModule
  ],
  declarations: [AccountComponent],
  providers: [
    AccountService,
    AccountTypeService,
    SubAccountTypeService,
    OperationTypeService,
    EntryService,
    TransactionService
  ]
})
export class LedgerModule {
}
