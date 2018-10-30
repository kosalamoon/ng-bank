import {Component, OnInit, TemplateRef} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {integers} from "../../shared/regex/regex";
import {Account} from "../../ledger/model/account";
import {Loan} from "../../loan/model/loan";
import {Observable} from "../../../../node_modules/rxjs";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {AuthenticationService} from "../../auth/authentication.service";
import {AccountService} from "../../ledger/service/account.service";
import {EntryService} from "../../ledger/service/entry.service";
import {TransactionService} from "../../ledger/service/transaction.service";
import {LoanStatusResponse} from "../../loan/model/loan-status-response";
import {LoanService} from "../../loan/service/loan.service";
import {Transaction} from "../../ledger/model/transaction";

@Component({
  selector: "app-loan-installment",
  templateUrl: "./loan-installment.component.html",
  styleUrls: ["./loan-installment.component.css"]
})
export class LoanInstallmentComponent implements OnInit {

  form: FormGroup;
  responseForm: FormGroup;

  accountNumber: FormControl = new FormControl(
    "13",
    [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(integers), this.validateAccountNumber.bind(this)],
  );

  amount: FormControl = new FormControl(null, [Validators.required, Validators.pattern(integers)]);

  account: Account;
  loan: Loan;
  transactions$: Observable<Transaction[]>;
  response: LoanStatusResponse;

  errorMsg: string = null;

  confirmModal: BsModalRef;


  constructor(private fb: FormBuilder, private authService: AuthenticationService,
              private accountService: AccountService, private entryService: EntryService,
              private transactionService: TransactionService, private modalService: BsModalService,
              private loanService: LoanService) {
  }

  //<editor-fold desc="responseForm getters">
  get interest() {
    return this.responseForm.get("interest");
  }

  get fine() {
    return this.responseForm.get("fine");
  }

  get principal() {
    return this.responseForm.get("principal");
  }

  ngOnInit() {
    this.createForm();
    this.createResponseForm();
  }

  createResponseForm() {
    this.responseForm = this.fb.group({
      "interest": [null, Validators.required],
      "fine": [null, Validators.required],
      "principal": [null, [Validators.required, this.validatePrincipal.bind(this)]]
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
    this.response = null;
    this.loanService.calculateInterestAndFine({accountNumber: this.account.number, amount: this.amount.value})
      .subscribe(response => {
        this.assignResponse(response);
        this.response = response;
      });
  }

  assignResponse(response: LoanStatusResponse) {
    (this.form.get("entryList") as FormArray).at(0).get("amount").patchValue(this.amount.value);
    (this.form.get("entryList") as FormArray).at(1).get("amount").patchValue(response.principal);
    (this.form.get("entryList") as FormArray).at(2).get("amount").patchValue(response.interest);

    if (response.fine !== "0") {
      (this.form.get("entryList") as FormArray).push(this.fb.group({
        "account": this.fb.group({"id": "11"}), // fine income account
        "amount": response.fine,
        "operationType": "Credit"
      }));
    }
    this.responseForm.patchValue({
      "interest": response.interest,
      "fine": response.fine,
      "principal": response.principal
    });
  }

  loadLoan(id: string) {
    this.loanService.findById(id).subscribe(loan => this.loan = loan);
  }

  loadTransactions() {
    this.transactions$ = this.transactionService.findAllByAccountNumber(this.accountNumber.value);
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
    console.log(this.accountNumber);
    if (this.accountNumber.valid && this.amount.valid && this.account != null && this.responseForm.valid) {
      this.confirmModal = this.modalService.show(template);
    }
  }

  onPersistYes() {
    this.transactionService.save(this.form.value).subscribe(value => {
      this.loanService.payInstallment(this.loan.id).subscribe(value1 => {
        this.closeModal();
        this.clearForm();
      });
    });
  }

  closeModal() {
    this.confirmModal.hide();
  }

  isInvalid(control: FormControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid
    };
  }

  validate() {
    this.accountNumber.markAsTouched();
    this.amount.markAsTouched();
  }

  validateAccountNumber(control: FormControl): { [s: string]: boolean } {
    return !(control.value as string).startsWith("13") ? {"numberIsForbidden": true} : null;
  }

  validatePrincipal(control: FormControl): { [s: string]: boolean } {
    if ((control.value as number) < 1) {
      return {"invalidAmount": true};
    } else {
      return null;
    }
  }

  private createForm() {
    this.form = this.fb.group({
      "entryType": "Transaction_Entry",
      "user": this.fb.group({
        "id": this.authService.getUserIdFromToken()
      }),
      "entryList": this.fb.array([
        this.fb.group({
          "account": this.fb.group({"id": "5"}), // cash account
          "amount": null,
          "operationType": "Debit"
        }),
        this.fb.group({
          "account": this.fb.group({"id": null}), // particular loan account
          "amount": null,
          "operationType": "Credit"
        }),
        this.fb.group({
          "account": this.fb.group({"id": "10"}), // interest income account
          "amount": null,
          "operationType": "Credit"
        }),
      ])
    });
  }

  //</editor-fold>

}
