import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AccountService} from "./service/account.service";
import {AccountTypeService} from "./service/account-type.service";
import {SubAccountTypeService} from "./service/sub-account-type.service";
import { AccountComponent } from './account/account.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AccountComponent],
  providers: [
    AccountService,
    AccountTypeService,
    SubAccountTypeService
  ]
})
export class LedgerModule { }
