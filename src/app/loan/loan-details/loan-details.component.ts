import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {Loan} from "../model/loan";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs/internal/Observable";
import {LoanType} from "../model/loan-type";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {LoanService} from "../service/loan.service";
import {LoanTypeService} from "../service/loan-type.service";
import {LoanStatusService} from "../service/loan-status.service";
import {Transaction} from "../../ledger/model/transaction";
import {TransactionService} from "../../ledger/service/transaction.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css'],
})
export class LoanDetailsComponent implements OnInit {

  dataSource: MatTableDataSource<Loan>;

  searchForm: FormGroup;

  loan: Loan;

  loanTypes$: Observable<LoanType[]>;
  loanStatuses$: Observable<string[]>;
  transactions$: Observable<Transaction[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public lineChartData: any[] = [];
  public lineChartLabels: string[] = [];

  modalRef: BsModalRef;

  constructor(private loanService: LoanService,
              private loanTypeService: LoanTypeService,
              private loanStatusService: LoanStatusService,
              private modalService: BsModalService,
              private transactionService: TransactionService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createSearchForm();
    this.loadLoans();
    this.loadLoanTypes();
    this.loadLoanStatuses();
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      "loanType": null,
      "member": this.fb.group({
        "fullName": null,
      }),
    });
  }

  loadLoans() {
    this.loanService.findAll()
      .pipe(map(value => value.filter(value1 => value1.loanStatus === 'Approved')))
      .subscribe(value => {
        this.initializeTable(value);
      });
  }

  loadLoanTypes() {
    this.loanTypes$ = this.loanTypeService.findAll();
  }

  loadLoanStatuses() {
    this.loanStatuses$ = this.loanStatusService.findAll();
  }

  history(loan: Loan) {
    this.loan = loan;
    this.loadTransactions(loan.account.number);
  }

  viewChart(template: TemplateRef<any>) {
    this.loanService.report(this.loan.id).subscribe(value => {
      this.lineChartData = [];
      this.lineChartData.push(value.paidData);
      this.lineChartData.push(value.emiData);
      this.lineChartLabels = value.monthList;
      this.lineChartData.forEach(data => {
        data.fill = false;
      });
      this.modalRef = this.modalService.show(template);
    });
  }

  loadTransactions(number: string) {
    this.transactions$ = this.transactionService.findAllByAccountNumber(number);
  }

  search() {
    this.loanService.search(this.searchForm.value)
      .pipe(map(value => value.filter(value1 => value1.loanStatus === 'Approved')))
      .subscribe(value => {
        this.initializeTable(value);
      });
  }

  clearSearch() {
    this.searchForm.reset();
    this.loadLoans();
  }

  closeModal() {
    this.modalRef.hide();
  }

  close() {
    this.transactions$ = null;
  }

  private initializeTable(loans: Loan[]) {
    this.dataSource = new MatTableDataSource(loans);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
  }

  sortingDataAccessor = (data: Loan, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "member":
        return data.member ? data.member.fullName : "";
      case "loanType":
        return data.loanType ? data.loanType.name : "";
      default:
        return data[sortHeaderId];
    }
  };

  columns: string[] = ["id", "member", "loanType", "requestedDate", "requestedAmount", "duration", "loanStatus", "remarks", "action"];
  displayedColumns: string[] = ["id", "member", "loanType", "requestedDate", "requestedAmount", "loanStatus", "duration", "action"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  compareDropdown = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;


}
