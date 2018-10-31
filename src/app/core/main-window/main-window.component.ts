import {Component, OnInit} from '@angular/core';
import {LoanService} from "../../loan/service/loan.service";
import {LoanReport} from "../../loan/model/loan-report";

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css'],
})
export class MainWindowComponent implements OnInit {

  loanReport: LoanReport;
  public lineChartData: any[] = [];
  public lineChartLabels: string[] = [];
  public lineChartOptions: any = {
    responsive: true,
    fill: false,
  };

  constructor(private loanService: LoanService) {
  }


  ngOnInit() {
    this.loadData();
  }

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  loadData() {
    this.loanService.report('1').subscribe(value => {
      this.loanReport = value;
      this.lineChartData.push(value.paidData);
      this.lineChartData.push(value.emiData);
      this.lineChartLabels = value.monthList;
      this.lineChartData.forEach(data => {
        data.fill = false;
        data.cubicInterpolationMode = 'default';
      });
    });
  }
}
