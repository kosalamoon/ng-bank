import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {AccountService} from "../service/account.service";
import {AccountTypeReport} from "../model/account-type-report";

@Component({
  selector: 'app-income-statement',
  templateUrl: './income-statement.component.html',
  styleUrls: ['./income-statement.component.css'],
})
export class IncomeStatementComponent implements OnInit {

  incomeStatement: AccountTypeReport[];

  dateRange: FormControl = new FormControl(null);

  today: Date = new Date();

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.loadIncomeStatement();
  }


  loadIncomeStatement() {
    let fromDate: string;
    let toDate: string;
    if (this.dateRange.value != null) {
      fromDate = this.convertDateToString(this.dateRange.value[0]) + "T00:00";
      toDate = this.convertDateToString(this.dateRange.value[1]) + "T23:59";
    }
    this.accountService.incomeStatement(fromDate, toDate).subscribe(value => {
      this.incomeStatement = value;
    });
  }

  clearRange() {
    this.dateRange.reset();
    this.loadIncomeStatement();
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
