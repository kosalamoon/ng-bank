import {Component, OnInit, TemplateRef} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {integers} from "../../shared/regex/regex";
import {Account} from "../../ledger/model/account";
import {Savings} from "../../savings/model/savings";
import {Entry} from "../../ledger/model/entry";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Observable} from "rxjs/internal/Observable";
import {AuthenticationService} from "../../auth/authentication.service";
import {AccountService} from "../../ledger/service/account.service";
import {EntryService} from "../../ledger/service/entry.service";
import {TransactionService} from "../../ledger/service/transaction.service";
import {SavingsService} from "../../savings/service/savings.service";
import {CashierReportService} from "../service/cashier-report.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: "app-withdraw",
  templateUrl: "./withdraw.component.html",
  styleUrls: ["./withdraw.component.css"]
})
export class WithdrawComponent implements OnInit {

  form: FormGroup;

  accountNumber: FormControl = new FormControl(
    "21",
    [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(integers), this.validateAccountNumber.bind(this)],
  );

  amount: FormControl = new FormControl(
    null,
    [Validators.required, Validators.pattern(integers)],
  );

  account: Account;
  savings: Savings;
  entries$: Observable<Entry[]>;

  errorMsg: string = null;

  confirmModal: BsModalRef;

  cash: Account;
  transactionId: string = null;

  constructor(private fb: FormBuilder, private authService: AuthenticationService,
              private accountService: AccountService, private entryService: EntryService,
              private transactionService: TransactionService, private modalService: BsModalService,
              private savingsService: SavingsService, private cashierService: CashierReportService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.createForm();
    this.assignAmount();
    this.loadCashAccount();
  }

  createForm() {
    this.form = this.fb.group({
      "entryType": "Transaction_Entry",
      "narration": null,
      "user": this.fb.group({
        "id": this.authService.getUserIdFromToken()
      }),
      "entryList": this.fb.array([
        this.fb.group({
          "account": this.fb.group({"id": null}),
          "amount": null,
          "operationType": "Debit"
        }),
        this.fb.group({
          "account": this.fb.group({"id": "1"}),
          "amount": null,
          "operationType": "Credit"
        })
      ])
    });
  }

  public get narration() {
    return this.form.get('narration') as FormControl;
  }

  assignAmount() {
    this.amount.valueChanges.subscribe(amount => {
      (this.form.get("entryList") as FormArray).controls.forEach(control => {
        control.patchValue({"amount": amount});
      });
    });
  }

  loadAccountByNumber() {
    this.errorMsg = null;
    this.accountService.findByNumber(this.accountNumber.value).subscribe(account => {
      if (account.savings == null) {
        this.errorMsg = "Please check again the account number !!!";
        return;
      }
      this.assignAccount(account);
      this.loadSavings(account.savings.id);
      this.account = account;
      this.withdrawLimitValidation();
      this.cashLimitValidation();
      this.entries$ = this.entryService.findTop5ByAccountNumber(this.accountNumber.value);
    }, error1 => {
      this.account = null;
      this.entries$ = null;
      this.errorMsg = "Please check again the account number !!!";
      setTimeout(() => this.errorMsg = null, 2000);
    });
  }

  assignAccount(account: Account) {
    (this.form.get("entryList") as FormArray)
      .at(0)
      .get("account.id").patchValue(account.id);
  }

  loadSavings(id: string) {
    this.savingsService.findById(id).subscribe(value => this.savings = value);
  }

  loadCashAccount() {
    this.accountService.findById("1").subscribe(value => {
      this.cash = value;
    });
  }

  clearForm() {
    this.accountNumber.reset("21");
    this.amount.reset();
    this.errorMsg = null;
    this.account = null;
    this.entries$ = null;
    this.narration.reset();
  }

  withdraw(template: TemplateRef<any>) {
    this.validate();
    console.log(this.accountNumber);
    if (this.accountNumber.valid && this.amount.valid && this.account != null) {
      this.confirmModal = this.modalService.show(template);
    }
  }

  onPersistYes() {
    this.transactionService.save(this.form.value).subscribe(value => {
      this.transactionId = value.id;
      this.clearForm();
      this.closeModal();
      this.openSnackBar(`Amount Withdrawn Successfully`);
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
    if (!(control.value as string).startsWith("21")) {
      return {"numberIsForbidden": true};
    }
    return null;
  }

  withdrawLimitValidation() {
    let func = (control: FormControl) => (control.value as number) > +this.account.balance ? {"invalidAmount": true} : null;
    this.amount.setValidators(func.bind(this));
  }

  cashLimitValidation() {
    let func = (control: FormControl) => (control.value as number) > +this.cash.balance ? {"cashLimit": true} : null;
    this.amount.setValidators(func.bind(this));
  }

  generateReport() {
    this.cashierService.deposit(this.transactionId, "withdraw").subscribe(value => {
      let file = new Blob([value], {type: 'application/pdf'});
      window.open(URL.createObjectURL(file), "_self");
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Close");
  }

}
