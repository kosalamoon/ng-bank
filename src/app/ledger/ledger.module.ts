import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AccountService} from "./service/account.service";
import {AccountTypeService} from "./service/account-type.service";
import {SubAccountTypeService} from "./service/sub-account-type.service";
import {AccountComponent} from "./account/account.component";
import {SharedModule} from "../shared/shared.module";
import {OperationTypeService} from "./service/operation-type.service";
import {ReactiveFormsModule} from "@angular/forms";
import {AlertModule, BsDatepickerModule, ModalModule} from "ngx-bootstrap";
import {EntryService} from "./service/entry.service";
import {TransactionService} from "./service/transaction.service";
import {JournalEntryComponent} from './journal-entry/journal-entry.component';
import {EntryTypeService} from "./service/entry-type.service";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    SharedModule
  ],
  declarations: [AccountComponent, JournalEntryComponent],
  providers: [
    AccountService,
    AccountTypeService,
    SubAccountTypeService,
    OperationTypeService,
    EntryService,
    TransactionService,
    EntryTypeService,
  ]
})
export class LedgerModule {
}
