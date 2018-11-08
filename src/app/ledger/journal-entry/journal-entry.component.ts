import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TransactionService} from "../service/transaction.service";
import {EntryService} from "../service/entry.service";
import {AccountService} from "../service/account.service";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../auth/authentication.service";
import {Observable} from "rxjs/internal/Observable";
import {EntryTypeService} from "../service/entry-type.service";
import {Account} from "../model/account";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {integers} from "../../shared/regex/regex";
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {Entry} from "../model/entry";

@Component({
  selector: 'app-journal-entry',
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.css'],
})
export class JournalEntryComponent implements OnInit {

  dataSource: MatTableDataSource<Entry>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  dateRange: FormControl = new FormControl(null);

  entryTypes$: Observable<string[]>;
  accounts$: Observable<Account[]>;

  entriesValidationError: boolean = null;

  confirmModal: BsModalRef;

  constructor(private transactionService: TransactionService,
              private entryService: EntryService,
              private entryTypeService: EntryTypeService,
              private accountService: AccountService,
              private fb: FormBuilder,
              private authService: AuthenticationService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();
    this.loadEntries();
    this.loadEntryTypes();
    this.loadAccounts();
  }

  createForm() {
    this.form = this.fb.group({
      "entryType": [null, Validators.required],
      "narration": [null, Validators.required],
      "user": this.fb.group({"id": this.authService.getUserIdFromToken()}),
      "entryList": this.fb.array([
        this.fb.group({
          "account": [null, Validators.required],
          "amount": [null, [Validators.required, Validators.pattern(integers)]],
          "operationType": [null, Validators.required],
        }),
        this.fb.group({
          "account": [null, Validators.required],
          "amount": [null, Validators.required],
          "operationType": [null, Validators.required],
        }),
      ]),
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      "account": null,
      "operationType": null,
      "transaction": this.fb.group({
        "entryType": null,
      }),
    });
  }

  sortingDataAccessor = (data: Entry, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "account":
        return data.account ? data.account.number : "";
      case "user":
        return data.transaction ? data.transaction.user.username : "";
      case "dateTime":
        return data.transaction ? data.transaction.dateTime : "";
      default:
        return data[sortHeaderId];
    }
  };

  private initializeTable(entries: Entry[]) {
    this.dataSource = new MatTableDataSource(entries);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
  }

  columns: string[] = ["id", "account", "amount", "operationType", "user", "dateTime"];
  displayedColumns: string[] = ["id", "account", "amount", "operationType", "user", "dateTime"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  loadEntries() {
    this.entryService.findAll().subscribe(value => {
      this.initializeTable(value);
    });
  }

  //<editor-fold desc="form-getters">

  public get entryType() {
    return this.form.get('entryType') as FormGroup;
  }

  public get narration() {
    return this.form.get('narration') as FormGroup;
  }

  public get entryList() {
    return this.form.get('entryList') as FormArray;
  }

  //</editor-fold>

  addEntry() {
    this.entryList.push(this.fb.group({
      "id": null,
      "account": [null, Validators.required],
      "amount": [null, Validators.required],
      "operationType": [null, Validators.required],
    }))
  }

  deleteEntry(i: number) {
    this.entryList.removeAt(i);
  }

  loadEntryTypes() {
    this.entryTypes$ = this.entryTypeService.findAll();
  }

  loadAccounts() {
    this.accounts$ = this.accountService.findAll();
  }

  clearForm() {
    this.form.reset();
    let extraEntries = this.entryList.length;
    for (let i = extraEntries - 1; i > 1; i--) {
      this.entryList.removeAt(i);
    }
  }

  search() {
    let fromDate: string;
    let toDate: string;
    if (this.dateRange.value != null) {
      fromDate = this.convertDateToString(this.dateRange.value[0]) + "T00:00";
      toDate = this.convertDateToString(this.dateRange.value[1]) + "T00:00";
    }
    this.entryService.search(this.searchForm.value, fromDate, toDate).subscribe(value => {
      this.initializeTable(value);
      return;
    });
  }

  clearSearch() {
    this.searchForm.reset();
    this.dateRange.reset();
    this.entryService.findAll().subscribe(value => {
      this.initializeTable(value);
    });
  }


  compareDropdown = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;

  validate(controls: string[]) {
    controls.forEach(control => {
      this.form.get(control).markAsTouched();
    });
  }

  validateEntries(controls: string[]) {
    controls.forEach(control => {
      this.entryList.controls.forEach(formGroup => {
        formGroup.get(control).markAsTouched();
      });
    });
  }

  requiredValidation(control: AbstractControl) {
    return control.hasError("required") && control.touched;
  }


  isInvalid(control: AbstractControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid,
    };
  }

  addEntries(template: TemplateRef<any>) {
    this.entriesValidationError = null;
    this.validate(["entryType", "narration", "entryList"]);
    this.validateEntries(["account", "operationType", "amount"]);
    if (this.form.valid) {
      this.doubleEntryValidation();
    }
    if (this.form.valid && this.entriesValidationError !== true) {
      console.log(this.form.value);
      this.confirmModal = this.modalService.show(template);
    }
  }

  closeModal() {
    this.confirmModal.hide();
  }

  onPersistYes() {
    this.transactionService.save(this.form.value).subscribe(value => {
      this.closeModal();
    });
  }

  doubleEntryValidation() {
    this.entriesValidationError = null;
    let totalCredit: number = 0;
    let totalDebit: number = 0;
    this.entryList.controls.forEach((group: FormGroup) => {
      if (group.get('operationType').value === 'Credit')
        totalCredit += +(group.get('amount').value as number);
      else
        totalDebit += +(group.get('amount').value as number)
    });
    if (totalCredit !== totalDebit) this.entriesValidationError = true;
  }

  groupBy = (item) => item.subAccountType.name;

  convertDateToString(value): string {
    if (value instanceof Date) {
      let fullDate: string;
      fullDate = value.getFullYear().toString() + "-";
      if (value.getMonth() < 9) {
        fullDate += "0" + (value.getMonth() + 1).toString() + "-";
      } else {
        fullDate += (value.getMonth() + 1).toString() + "-";
      }
      if (value.getDate() < 10) {
        fullDate += "0" + (value.getDate()).toString();
      } else {
        fullDate += value.getDate().toString();
      }
      return fullDate;
    }
    else
      return value;
  }


}
