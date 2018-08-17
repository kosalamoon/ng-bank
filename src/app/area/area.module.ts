import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DivisionComponent} from "./division/division.component";
import {SocietyComponent} from "./society/society.component";
import {TeamComponent} from "./team/team.component";
import {SharedModule} from "../shared/shared.module";
import {DivisionService} from "./service/division.service";
import {SocietyService} from "./service/society.service";
import {TeamService} from "./service/team.service";
import {ReactiveFormsModule} from "@angular/forms";
import {BsDropdownModule} from "ngx-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BsDropdownModule
  ],
  declarations: [
    DivisionComponent,
    SocietyComponent,
    TeamComponent
  ],
  providers: [
    DivisionService,
    SocietyService,
    TeamService
  ]
})
export class AreaModule {
}
