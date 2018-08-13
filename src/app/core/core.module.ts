import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "./header/header.component";
import {HomeComponent} from "./home/home.component";
import {FooterComponent} from "./footer/footer.component";
import {BsDropdownModule} from "ngx-bootstrap";
import {RouterModule} from "@angular/router";
import { MainWindowComponent } from './main-window/main-window.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    MainWindowComponent,
  ],
  providers: []
})
export class CoreModule {
}
