import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SavingsService} from "../service/savings.service";
import {Observable} from "rxjs/internal/Observable";
import {Account} from "../../ledger/model/account";
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {Entry} from "../../ledger/model/entry";
import {EntryService} from "../../ledger/service/entry.service";
import {AccountService} from "../../ledger/service/account.service";

@Component({
  selector: 'app-savings-history',
  templateUrl: './savings-history.component.html',
  styleUrls: ['./savings-history.component.css'],
})
export class SavingsHistoryComponent implements OnInit {

  dataSource: MatTableDataSource<Entry>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchForm: FormGroup;

  account: FormControl = new FormControl(null, Validators.required);
  fromDate: FormControl = new FormControl(null, Validators.required);
  toDate: FormControl = new FormControl(null, Validators.required);

  accounts$: Observable<Account[]>;


  constructor(private savingsService: SavingsService,
              private fb: FormBuilder,
              private entryService: EntryService,
              private accountService: AccountService) {
  }

  ngOnInit() {
    this.loadAccounts();
  }

  private initializeTable(entries: Entry[]) {
    this.dataSource = new MatTableDataSource(entries);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
  }

  sortingDataAccessor = (data: Entry, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "dateTime":
        return data.transaction ? data.transaction.dateTime : "";
      case "narration":
        return data.transaction ? data.transaction.narration : "";
      default:
        return data[sortHeaderId];
    }
  };

  columns: string[] = ["id", "narration", "dateTime", "deposits", "withdrawals"];
  displayedColumns: string[] = ["id", "narration", "dateTime", "deposits", "withdrawals"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  loadAccounts() {
    this.accounts$ = this.accountService.findAllHavingSavings();
  }

  loadEntries() {
    this.account.markAsTouched();
    this.fromDate.markAsTouched();
    this.toDate.markAsTouched();
    if (this.account.valid && this.fromDate.valid && this.toDate.valid) {
      let fromDate: string = this.convertDateToString(this.fromDate.value) + "T00:00";
      let toDate: string = this.convertDateToString(this.toDate.value) + "T00:00";
      this.entryService.findAllByAccountNumber(this.account.value.number, fromDate, toDate).subscribe(value => {
        this.initializeTable(value);
      });
    }
  }

  clearControls() {
    this.account.reset();
    this.fromDate.reset();
    this.toDate.reset();
    this.dataSource = null;
  }

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

  groupBy = (item) => item.subAccountType.name;

  requiredValidation(control: AbstractControl) {
    return control.hasError("required") && control.touched;
  }


  isInvalid(control: AbstractControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid,
    };
  }

}
