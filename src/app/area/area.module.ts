import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DivisionComponent} from "./division/division.component";
import {SocietyComponent} from "./society/society.component";
import {TeamComponent} from "./team/team.component";
import {MdComponentsModule} from "../md-components/md-components.module";
import {DivisionService} from "../service/division.service";
import {SocietyService} from "../service/society.service";
import {TeamService} from "../service/team.service";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MdComponentsModule,
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
