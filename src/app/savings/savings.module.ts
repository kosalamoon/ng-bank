import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {AlertModule, BsDatepickerModule, ModalModule} from "ngx-bootstrap";
import {SharedModule} from "../shared/shared.module";
import {SavingsComponent} from "./savings/savings.component";
import {SavingTypeService} from "./service/saving-type.service";
import {SavingsService} from "./service/savings.service";
import {SavingsStatusService} from "./service/saving-status.service";
import {SavingsHistoryComponent} from './savings-history/savings-history.component';
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
  declarations: [SavingsComponent, SavingsHistoryComponent],
  providers: [
    SavingTypeService,
    SavingsService,
    SavingsStatusService,
  ]
})
export class SavingsModule {
}
