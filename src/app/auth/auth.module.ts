import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {LoginComponent} from "./login/login.component";
import {JwtModule} from "@auth0/angular-jwt";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AlertModule} from "ngx-bootstrap";

const jwtConfig = {
  tokenGetter: () => sessionStorage.getItem('token'),
  whitelistedDomains: ['localhost:8080'],
  blacklistedRoutes: ['localhost:8080/login', 'localhost:8080/register'],
  throwNoTokenError: false
};

@NgModule({
  imports: [
    CommonModule,
    JwtModule.forRoot({config: jwtConfig}),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot()
  ],
  declarations: [
    ChangePasswordComponent,
    LoginComponent,
  ]
})
export class AuthModule { }
