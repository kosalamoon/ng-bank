import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {AlertModule, ModalModule} from "ngx-bootstrap";
import {SharedModule} from "../shared/shared.module";
import {SavingsComponent} from "./savings/savings.component";
import {SavingTypeService} from "./service/saving-type.service";
import {SavingsService} from "./service/savings.service";
import {SavingStatusService} from "./service/saving-status.service";

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    SharedModule
  ],
  declarations: [SavingsComponent],
  providers: [
    SavingTypeService,
    SavingsService,
    SavingStatusService
  ]
})
export class SavingsModule {
}
