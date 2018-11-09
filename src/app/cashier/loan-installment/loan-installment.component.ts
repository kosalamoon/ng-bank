import {Component, OnInit, TemplateRef} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {integers} from "../../shared/regex/regex";
import {Account} from "../../ledger/model/account";
import {Loan} from "../../loan/model/loan";
import {Observable} from "rxjs/internal/Observable";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {AuthenticationService} from "../../auth/authentication.service";
import {AccountService} from "../../ledger/service/account.service";
import {EntryService} from "../../ledger/service/entry.service";
import {TransactionService} from "../../ledger/service/transaction.service";
import {LoanStatusResponse} from "../../loan/model/loan-status-response";
import {LoanService} from "../../loan/service/loan.service";
import {Transaction} from "../../ledger/model/transaction";
import {CashierReportService} from "../service/cashier-report.service";

@Component({
  selector: "app-loan-installment",
  templateUrl: "./loan-installment.component.html",
  styleUrls: ["./loan-installment.component.css"],
})
export class LoanInstallmentComponent implements OnInit {


  form: FormGroup;
  responseForm: FormGroup;

  validateAccountNumber = (control: FormControl) => !(control.value as string).startsWith("13") ? {"numberIsForbidden": true} : null;

  accountNumber: FormControl = new FormControl(
    "13",
    [Validators.required,
      Validators.minLength(5),
      Validators.maxLength(5),
      Validators.pattern(integers),
      this.validateAccountNumber.bind(this)],
  );

  amount: FormControl = new FormControl(null,
    [Validators.required, Validators.pattern(integers)]);
  account: Account;
  loan: Loan;
  transactions$: Observable<Transaction[]>;

  nextInstallmentAmount: string;
  arrears: string;
  remainingAmount: string;

  response: LoanStatusResponse;

  errorMsg: string = null;


  confirmModal: BsModalRef;

  transactionId: string = null;

  constructor(private fb: FormBuilder, private authService: AuthenticationService,
              private accountService: AccountService, private entryService: EntryService,
              private transactionService: TransactionService, private modalService: BsModalService,
              private loanService: LoanService, private cashierService: CashierReportService) {
  }

  ngOnInit() {
    this.createForm();
    this.createResponseForm();
  }

  private createForm() {
    this.form = this.fb.group({
      "entryType": "Transaction_Entry",
      "narration": null,
      "user": this.fb.group({
        "id": this.authService.getUserIdFromToken(),
      }),
      "entryList": this.fb.array([
        this.fb.group({
          "account": this.fb.group({"id": "1"}), // cash account
          "amount": null,
          "operationType": "Debit",
        }),
        this.fb.group({
          "account": this.fb.group({"id": null}), // particular loan account
          "amount": null,
          "operationType": "Credit",
        }),
        this.fb.group({
          "account": this.fb.group({"id": "3"}), // interest income account
          "amount": null,
          "operationType": "Credit",
        }),
      ]),
    });
  }

  public get narration() {
    return this.form.get('narration') as FormControl;
  }

  createResponseForm() {
    this.responseForm = this.fb.group({
      "interest": [null, Validators.required],
      "principal": [null, Validators.required],
      "total": [null, Validators.required],
    });
  }


  loadAccountByNumber() {
    this.errorMsg = null;
    this.accountService.findByNumber(this.accountNumber.value).subscribe(account => {
      if (account.loan == null) { // does the account has a loan ?
        this.errorMsg = "Please check again the account number !!!";
        setTimeout(() => this.errorMsg = null, 2000);
        return;
      }
      this.account = account;
      this.loadLoan(account.loan.id);
      this.loadTransactions();
      this.assignAccount(account);
      this.getNextInstallmentAmount(account.loan.id);
      this.getArrears(account.loan.id);
      this.getRemainingAmount(account.loan.id);

    }, error1 => {
      this.account = null;
      this.loan = null;
      this.transactions$ = null;
      this.errorMsg = "Please check again the account number !!!";
      setTimeout(() => this.errorMsg = null, 2000);
    });
  }

  assignAccount(account: Account) {
    (this.form.get("entryList") as FormArray).at(1).get("account.id").patchValue(account.id);
  }

  calculateInterestAndFine() {
    this.validate();
    if (!this.amount.valid) return;
    this.response = null;
    this.loanService.calculateInterest({accountNumber: this.account.number, amount: this.amount.value})
      .subscribe(response => {
        this.response = response;
        this.assignResponse(response);
        this.addTotalValidation();
      });
  }

  assignResponse(response: LoanStatusResponse) {
    (this.form.get("entryList") as FormArray).at(0).get("amount").patchValue(this.amount.value);
    (this.form.get("entryList") as FormArray).at(1).get("amount").patchValue(response.principal);
    (this.form.get("entryList") as FormArray).at(2).get("amount").patchValue(response.interest);

    this.responseForm.patchValue({
      "interest": response.interest,
      "principal": response.principal,
      "total": this.amount.value,
    });
  }

  loadLoan(id: string) {
    this.loanService.findById(id).subscribe(loan => this.loan = loan);
  }

  loadTransactions() {
    this.transactions$ = this.transactionService.findAllByAccountNumber(this.accountNumber.value);
  }

  getNextInstallmentAmount(id: string) {
    this.loanService.nextInstallmentAmount(id).subscribe(value => this.nextInstallmentAmount = value);
  }

  getArrears(id: string) {
    this.loanService.calculateArrears(id).subscribe(value => this.arrears = value);

  }

  getRemainingAmount(id: string) {
    this.loanService.calculateRemainingAmount(id).subscribe(value => {
      this.remainingAmount = value;
    });
  }

  clearForm() {
    this.accountNumber.reset("13");
    this.amount.reset();
    this.errorMsg = null;
    this.account = null;
    this.loan = null;
    this.transactions$ = null;
    this.response = null;
  }

  addInstallment(template: TemplateRef<any>) {
    this.validate();
    if (this.accountNumber.valid && this.amount.valid && this.account != null && this.responseForm.valid) {
      this.confirmModal = this.modalService.show(template);
    }
  }

  onPersistYes() {
    this.transactionService.save(this.form.value).subscribe(value => {
      this.closeModal();
      this.clearForm();
    });
  }

  closeModal() {
    this.confirmModal.hide();
  }

  isInvalid(control: FormControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid,
    };
  }

  validate() {
    this.accountNumber.markAsTouched();
    this.amount.markAsTouched();
    this.total.markAsTouched();
  }


  private addTotalValidation() {
    let func = control => (control.value as number) < +this.response.interest ? {"invalidAmount": true} : null;
    this.total.setValidators(func.bind(this));
  }

  generateReport() {
    this.cashierService.loan(this.transactionId).subscribe(value => {
      let file = new Blob([value], {type: 'application/pdf'});
      window.open(URL.createObjectURL(file), "_self");
    });
  }

  //<editor-fold desc="responseForm getters">
  get interest() {
    return this.responseForm.get("interest");
  }

  get principal() {
    return this.responseForm.get("principal");
  }

  get total() {
    return this.responseForm.get("total");
  }

  //</editor-fold>

}
