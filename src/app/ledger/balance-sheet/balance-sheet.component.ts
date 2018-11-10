import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {AccountService} from "../service/account.service";
import {AccountTypeReport} from "../model/account-type-report";

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css'],
})
export class BalanceSheetComponent implements OnInit {

  balanceSheet: AccountTypeReport[];

  dateRange: FormControl = new FormControl(null);

  today: Date = new Date();

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.loadBalanceSheet();
  }

  loadBalanceSheet() {
    let fromDate: string;
    let toDate: string;
    if (this.dateRange.value != null) {
      fromDate = this.convertDateToString(this.dateRange.value[0]) + "T00:00";
      toDate = this.convertDateToString(this.dateRange.value[1]) + "T23:59";
    }
    this.accountService.balanceSheet(fromDate, toDate).subscribe(value => {
      this.balanceSheet = value;
    });
  }

  clearRange() {
    this.dateRange.reset();
    this.loadBalanceSheet();
  }


  convertDateToString(value): string {
    if (value instanceof Date) {
      let fullDate: string;
      fullDate = value.getFullYear().toString() + "-";
      if (value.getMonth() < 9) {
        fullDate += "0" + (value.getMonth() + 1).toString() + "-";
      } else {
        fullDate += (value.getMonth() + 1).toString() + "-";
      }
      if (value.getDate() < 10) {
        fullDate += "0" + (value.getDate()).toString();
      } else {
        fullDate += value.getDate().toString();
      }
      return fullDate;
    }
    else
      return value;
  }

}
