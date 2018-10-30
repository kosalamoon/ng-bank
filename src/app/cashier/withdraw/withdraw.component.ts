import {Component, OnInit, TemplateRef} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {integers} from "../../shared/regex/regex";
import {Account} from "../../ledger/model/account";
import {Savings} from "../../savings/model/savings";
import {Entry} from "../../ledger/model/entry";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Observable} from "../../../../node_modules/rxjs";
import {AuthenticationService} from "../../auth/authentication.service";
import {AccountService} from "../../ledger/service/account.service";
import {EntryService} from "../../ledger/service/entry.service";
import {TransactionService} from "../../ledger/service/transaction.service";
import {SavingsService} from "../../savings/service/savings.service";

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

  constructor(private fb: FormBuilder, private authService: AuthenticationService,
              private accountService: AccountService, private entryService: EntryService,
              private transactionService: TransactionService, private modalService: BsModalService,
              private savingsService: SavingsService) {
  }

  ngOnInit() {
    this.createForm();
    this.assignAmount();
  }

  createForm() {
    this.form = this.fb.group({
      "entryType": "Transaction_Entry",
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
          "account": this.fb.group({"id": "5"}),
          "amount": null,
          "operationType": "Credit"
        })
      ])
    });
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
      this.entries$ = this.entryService.findTop3ByAccountNumber(this.accountNumber.value);
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

  clearForm() {
    this.accountNumber.reset("21");
    this.amount.reset();
    this.errorMsg = null;
    this.account = null;
    this.entries$ = null;
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

}
