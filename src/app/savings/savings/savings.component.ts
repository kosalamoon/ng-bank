import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../ledger/service/account.service";
import {SavingsService} from "../../cashier/service/savings.service";
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {Savings} from "../model/savings";
import {Observable} from "../../../../node_modules/rxjs";
import {SavingType} from "../model/saving-type";
import {BsModalRef} from "ngx-bootstrap/modal";
import {SavingsTypeService} from "../service/savings-type.service";
import {Division} from "../../area/model/division";
import {Society} from "../../area/model/society";
import {Team} from "../../area/model/team";

@Component({
  selector: "app-savings",
  templateUrl: "./savings.component.html",
  styleUrls: ["./savings.component.css"]
})
export class SavingsComponent implements OnInit {

  dataSource: MatTableDataSource<Savings>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  savingTypes$: Observable<SavingType[]>;

  divisions$: Observable<Division[]>;
  societies$: Observable<Society[]>;
  teams$: Observable<Team[]>;

  modalRef: BsModalRef;
  sortingDataAccessor = (data: Savings, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "savingType":
        return data.savingType.name;
      case "account":
        return data.account ? data.account.number : "";
      case "member":
        return data.member ? data.member.fullName : "";
      default:
        return data[sortHeaderId];
    }
  };
  columns: string[] = ["id", "savingsAccountStatus", "savingType", "account", "member"];
  displayedColumns: string[] = ["id", "savingsAccountStatus", "savingType", "account", "member"];

  constructor(private fb: FormBuilder, private accountService: AccountService,
              private savingsService: SavingsService, private savingsTypeService: SavingsTypeService) {
  }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();
  }

  createForm() {
    this.form = this.fb.group({
      "id": null,
      "savingsAccountStatus": [null, Validators.required],
      "savingType": [null, Validators.required],
      "account": [null, Validators.required],
      "member": [null, Validators.required]
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      "savingsAccountStatus": null,
      "savingType": null,
      "account": this.fb.group({
        "number": null
      }),
      "member": this.fb.group({
        "id": null
      })
    });
  }

  fillForm(savings: Savings) {
    this.clearForm();
    this.form.patchValue({
      "id": savings.id,
      "savingsAccountStatus": savings.savingsAccountStatus,
      "savingType": savings.savingType,
      "account": savings.account,
      "member": savings.member
    });
  }

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  private initializeTable(savings: Savings[]) {
    this.dataSource = new MatTableDataSource(savings);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
  }

  private loadSavingsTypes() {
    this.savingTypes$ = this.savingsTypeService.findAll();
  }

  private clearForm() {
    this.form.reset();
  }


}
