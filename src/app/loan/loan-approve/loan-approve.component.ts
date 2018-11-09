import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatPaginator, MatSelectChange, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {Loan} from "../model/loan";
import {LoanService} from "../service/loan.service";
import {MemberService} from "../../person/service/member.service";
import {Member} from "../../person/model/member";
import {TeamService} from "../../area/service/team.service";
import {Observable} from "rxjs/internal/Observable";
import {Savings} from "../../savings/model/savings";
import {SavingsService} from "../../savings/service/savings.service";
import {map} from "rxjs/operators";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LoanType} from "../model/loan-type";
import {LoanTypeService} from "../service/loan-type.service";
import {Team} from "../../area/model/team";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {AccountService} from "../../ledger/service/account.service";
import {Account} from "../../ledger/model/account";
import {LoanStatusService} from "../service/loan-status.service";

@Component({
  selector: 'app-loan-approve',
  templateUrl: './loan-approve.component.html',
  styleUrls: ['./loan-approve.component.css'],
})
export class LoanApproveComponent implements OnInit {

  dataSource: MatTableDataSource<Loan>;

  searchForm: FormGroup;

  loanTypes$: Observable<LoanType[]>;
  loanStatuses$: Observable<string[]>;

  loan: Loan;
  member: Member;
  team: Team;
  approvedLoans$: Observable<Loan[]>;
  savings$: Observable<Savings[]>;

  cash: Account;
  bank: Account;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  detailsComponent: boolean;
  approvalComponent: boolean;

  releaseType: FormControl = new FormControl("CASH");
  account: FormControl = new FormControl(null, Validators.required);

  modalRef: BsModalRef;

  constructor(private loanService: LoanService,
              private memberService: MemberService,
              private teamService: TeamService,
              private savingsService: SavingsService,
              private loanTypeService: LoanTypeService,
              private loanStatusService: LoanStatusService,
              private accountService: AccountService,
              private modalService: BsModalService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar) {
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
      "loanStatus": null,
      "member": this.fb.group({
        "fullName": null,
      }),
    });
  }

  loadLoans() {
    this.loanService.findAll().subscribe(value => {
      this.initializeTable(value);
    });
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

  approve(loan: Loan) {
    this.loan = loan;
    this.memberService.findById(loan.member.id).subscribe(value => {
      this.member = value;
      this.loadApprovedLoansByMemberId(loan.member.id);
      this.loadSavingsByMemberId(loan.member.id);
      this.loadTeamById(value.team.id);
      this.loadAccounts();
      this.detailsComponent = false;
      this.approvalComponent = true;
    });
  }

  loadMemberDetails(id: string) {
    this.memberService.findById(id).subscribe(value => {
      this.member = value;
      this.approvalComponent = false;
      this.detailsComponent = true;
    });
  }

  loadTeamById(id: string) {
    this.teamService.findById(id).subscribe(value => {
      this.team = value;
    });
  }


  loadApprovedLoansByMemberId(id: string) {
    this.approvedLoans$ = this.loanService.findAllByMemberId(id).pipe(
      map(loans => loans.filter(loan => loan.id !== this.loan.id)),
    );
  }

  loadSavingsByMemberId(id: string) {
    this.savings$ = this.savingsService.findAllByMember(id);
  }

  loadLoanTypes() {
    this.loanTypes$ = this.loanTypeService.findAll();
  }

  loadLoanStatuses() {
    this.loanStatuses$ = this.loanStatusService.findAll();
  }

  loadAccounts() {
    this.accountService.findById("1").subscribe(value => {
      this.cash = value;
    });
    this.accountService.findById("2").subscribe(value => {
      this.bank = value;
    });
  }

  search() {
    this.loanService.search(this.searchForm.value).subscribe(value => {
      this.initializeTable(value);
    });
  }

  clearSearch() {
    this.searchForm.reset();
    this.loadLoans();
  }

  close() {
    this.detailsComponent = false;
    this.approvalComponent = false;
  }

  tableRowStyle(required, available) {
    return {
      "table-danger": required > available,
      "table-success": required <= available,
    };
  }

  isInvalid(control: FormControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid,
    };
  }

  requiredValidation(control: FormControl) {
    return control.hasError("required") && control.touched;
  }

  release(template: TemplateRef<any>) {
    if (this.releaseType.value === "ACCOUNT") {
      this.account.markAsTouched();
      if (this.account.valid) {
        this.modalRef = this.modalService.show(template);
      }
    } else
      this.modalRef = this.modalService.show(template);
  }

  reject(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onReleaseYes() {
    this.loanService.approve(this.loan.id, this.releaseType.value, this.account.value).subscribe(value => {
      this.loadLoans();
      this.closeModal();
      this.openSnackBar(`Loan having ID ${value.id} released successfully`);
    });
  }

  onRejectYes() {
    this.loanService.reject(this.loan.id).subscribe(value => {
      this.loadLoans();
      this.closeModal();
      this.openSnackBar(`Loan having ID ${value.id} rejected successfully`);
    });
  }

  no() {
    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Close");
  }

}
