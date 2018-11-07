import {Component, OnInit, TemplateRef} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {integers} from "../../shared/regex/regex";
import {Account} from "../../ledger/model/account";
import {Entry} from "../../ledger/model/entry";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Observable} from "rxjs/internal/Observable";
import {AuthenticationService} from "../../auth/authentication.service";
import {AccountService} from "../../ledger/service/account.service";
import {EntryService} from "../../ledger/service/entry.service";
import {TransactionService} from "../../ledger/service/transaction.service";
import {Savings} from "../../savings/model/savings";
import {SavingsService} from "../../savings/service/savings.service";
import {CashierReportService} from "../service/cashier-report.service";

@Component({
  selector: "app-deposit",
  templateUrl: "./deposit.component.html",
  styleUrls: ["./deposit.component.css"],
})
export class DepositComponent implements OnInit {

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

  transactionId: string = null;

  constructor(private fb: FormBuilder, private authService: AuthenticationService,
              private accountService: AccountService, private entryService: EntryService,
              private transactionService: TransactionService, private modalService: BsModalService,
              private savingsService: SavingsService, private cashierService: CashierReportService) {
  }

  ngOnInit() {
    this.createForm();
    this.assignAmount();
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
      this.entries$ = this.entryService.findTop5ByAccountNumber(this.accountNumber.value);
    }, error1 => {
      this.account = null;
      this.savings = null;
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

  clearForm() {
    this.accountNumber.reset("21");
    this.amount.reset();
    this.errorMsg = null;
    this.account = null;
    this.entries$ = null;
    this.narration.reset();
  }

  addDeposits(template: TemplateRef<any>) {
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
  }

  validateAccountNumber(control: FormControl): { [s: string]: boolean } {
    if (!(control.value as string).startsWith("21")) {
      return {"numberIsForbidden": true};
    }
    return null;
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
          "account": this.fb.group({"id": null}),
          "amount": null,
          "operationType": "Credit",
        }),
        this.fb.group({
          "account": this.fb.group({"id": "1"}),
          "amount": null,
          "operationType": "Debit",
        }),
      ]),
    });
  }

  public get narration() {
    return this.form.get('narration') as FormControl;
  }

  private assignAmount() {
    this.amount.valueChanges.subscribe(amount => {
      (this.form.get("entryList") as FormArray).controls.forEach(control => {
        control.patchValue({"amount": amount});
      });
    });
  }

  generateReport() {
    this.cashierService.deposit(this.transactionId, "deposit").subscribe(value => {
      let file = new Blob([value], {type: 'application/pdf'});
      window.open(URL.createObjectURL(file), "_self");
    });
  }

}
