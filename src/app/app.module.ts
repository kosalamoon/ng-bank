import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AuthenticationService} from "./auth/authentication.service";
import {AppRoutingModule} from "./app-routing.module";
import {AuthModule} from "./auth/auth.module";
import {CoreModule} from "./core/core.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SharedModule} from "./shared/shared.module";
import {AreaModule} from "./area/area.module";
import {MeetingModule} from "./meeting/meeting.module";
import {PersonModule} from "./person/person.module";
import {LedgerModule} from "./ledger/ledger.module";
import {CashierModule} from "./cashier/cashier.module";
import {SavingsModule} from "./savings/savings.module";
import {LoanModule} from "./loan/loan.module";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from "@angular/material";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),

    AuthModule,
    CoreModule,
    PersonModule,
    AreaModule,
    MeetingModule,
    LedgerModule,
    CashierModule,
    SavingsModule,
    LoanModule,

    SharedModule,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500, panelClass: ['snack-bar']}},
    // {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    AuthenticationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
