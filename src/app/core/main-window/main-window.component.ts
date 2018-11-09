import {Component, OnInit} from '@angular/core';
import {LoanService} from "../../loan/service/loan.service";
import {PieChart} from "../model/pie-chart";
import {HttpResponse} from "@angular/common/http";
import {AccountService} from "../../ledger/service/account.service";
import {LineChart} from "../model/line-chart";
import {DataSet} from "../../loan/model/loan-report";
import {SavingsService} from "../../savings/service/savings.service";

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css'],
})
export class MainWindowComponent implements OnInit {

  loanPieChart: PieChart;
  loansToBeApproved: string;
  totalArrears: string;

  savingsLineChart: LineChart;
  savingsPieChart: PieChart;

  sharesLineChart: DataSet[];
  teamsLineChart: DataSet[];

  cashBalance: string;
  bankBalance: string;


  constructor(private loanService: LoanService,
              private accountService: AccountService,
              private savingService: SavingsService) {
  }


  ngOnInit() {
    this.loadLoanPieChart();
    this.loadLoansToBeApproved();
    this.loadTotalArrears();
    this.loadAccountBalances();
    this.loadLineCharts();
    this.loadSavingsPieChart();
  }

  loadLoanPieChart() {
    this.loanService.getAllByLoanType().subscribe(value => {
      this.loanPieChart = value;
    });
  }

  loadLoansToBeApproved() {
    this.loanService.loansToBeApproved().subscribe((value: HttpResponse<string>) => {
      this.loansToBeApproved = value.body;
    });
  }

  loadTotalArrears() {
    this.loanService.totalArrears().subscribe((value: HttpResponse<string>) => {
      this.totalArrears = value.body;
    });
  }

  loadAccountBalances() {
    this.accountService.findById("1").subscribe(value => { // cash account number
      this.cashBalance = value.balance;
    });
    this.accountService.findById("10").subscribe(value => { // bank account number
      this.bankBalance = value.balance;
    });
  }

  loadLineCharts() {
    this.accountService.sharesReport().subscribe(value => {
      this.sharesLineChart = value;
    });
    this.accountService.teamReport().subscribe(value => {
      this.teamsLineChart = value;
    });
    this.savingService.reportByType().subscribe(value => {
      this.savingsLineChart = value;
    });
  }

  loadSavingsPieChart() {
    this.savingService.getPieChart().subscribe(value => {
      this.savingsPieChart = value;
    });
  }

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  cashBarStyle = () => +this.cashBalance >= 600000 ? "danger" : +this.cashBalance >= 400000 ? "warning" : "success";

  bankBarStyle = () => +this.bankBalance >= 4000000 ? "danger" : +this.bankBalance >= 2500000 ? "warning" : "success";


}
