import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "../../auth/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {

  username: string;

  constructor(public authService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.username = this.authService.getUsernameFromToken();
  }

  logout() {
    if (this.authService.logOut()) {
      this.router.navigate([""]);
    }
  }

  changePassword() {
    this.router.navigate(["/changePassword", this.authService.getUsernameFromToken()]);
  }

  isAuthorized(role: string) {
    return this.authService.isAuthorized(role);
    ;
  }
}
