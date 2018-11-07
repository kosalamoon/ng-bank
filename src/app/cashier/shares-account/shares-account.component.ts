import {Component, OnInit, TemplateRef} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../auth/authentication.service";
import {AccountService} from "../../ledger/service/account.service";
import {Account} from "../../ledger/model/account";
import {Observable} from "../../../../node_modules/rxjs";
import {Entry} from "../../ledger/model/entry";
import {EntryService} from "../../ledger/service/entry.service";
import {TransactionService} from "../../ledger/service/transaction.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {integers} from "../../shared/regex/regex";

@Component({
  selector: "app-share",
  templateUrl: "./shares-account.component.html",
  styleUrls: ["./shares-account.component.css"]
})
export class SharesAccountComponent implements OnInit {

  form: FormGroup;

  accountNumber: FormControl = new FormControl(
    "31",
    [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(integers), this.validateAccountNumber.bind(this)],
  );

  amount: FormControl = new FormControl(
    null,
    [Validators.required, Validators.pattern(integers)],
  );

  numberOfShares: FormControl = new FormControl(null);

  account: Account;
  entries$: Observable<Entry[]>;

  errorMsg: string = null;

  confirmModal: BsModalRef;

  constructor(private fb: FormBuilder, private authService: AuthenticationService,
              private accountService: AccountService, private entryService: EntryService,
              private transactionService: TransactionService, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.createForm();
    this.assignAmount();
    this.calculateNumberOfShares();
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
          "operationType": "Credit"
        }),
        this.fb.group({
          "account": this.fb.group({"id": "1"}),
          "amount": null,
          "operationType": "Debit"
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
      if (account.shareHolder == null) {
        this.errorMsg = "Please check again the account number !!!";
        return;
      }
      this.assignAccount(account);
      this.account = account;
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

  clearForm() {
    this.accountNumber.reset("31");
    this.amount.reset();
    this.errorMsg = null;
    this.account = null;
    this.entries$ = null;
    this.numberOfShares.reset();
  }

  addShares(template: TemplateRef<any>) {
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

  calculateNumberOfShares() {
    this.amount.valueChanges
      .subscribe(value => this.numberOfShares.setValue(this.round(value)));
  }

  round(number) {
    return Math.floor((number as number) / 500);
  }

  validate() {
    this.accountNumber.markAsTouched();
    this.amount.markAsTouched();
  }

  validateAccountNumber(control: FormControl): { [s: string]: boolean } {
    if (!(control.value as string).startsWith("31")) {
      return {"numberIsForbidden": true};
    }
    return null;
  }

}
