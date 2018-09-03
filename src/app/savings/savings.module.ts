import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {AlertModule, ModalModule} from "ngx-bootstrap";
import {SharedModule} from "../shared/shared.module";
import {SavingsComponent} from "./savings/savings.component";
import {SavingsTypeService} from "./service/savings-type.service";

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
    SavingsTypeService
  ]
})
export class SavingsModule {
}
