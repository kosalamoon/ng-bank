import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Account} from "../model/account";
import {Observable} from "rxjs/internal/Observable";
import {AccountType} from "../model/account-type";
import {SubAccountType} from "../model/sub-account-type";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {AccountService} from "../service/account.service";
import {AccountTypeService} from "../service/account-type.service";
import {SubAccountTypeService} from "../service/sub-account-type.service";
import {OperationTypeService} from "../service/operation-type.service";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit {

  dataSource: MatTableDataSource<Account>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  operationTypes$: Observable<string[]>;
  accountTypes$: Observable<AccountType[]>;
  subAccountTypes$: Observable<SubAccountType[]>;

  confirmModal: BsModalRef;
  sortingDataAccessor = (data: Account, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "team":
        return data.team.name;
      case "accountType":
        return data.accountType.id;
      case "subAccountType":
        return data.subAccountType.id;
      default:
        return data[sortHeaderId];
    }
  };
  columns: string[] = ["id", "number", "name", "balance", "operationType", "accountType", "subAccountType"];
  displayedColumns: string[] = ["id", "number", "name", "balance", "operationType", "accountType", "subAccountType"];
  compareDropdown = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;
  compareTableColumns = (o1: any, o2: any) => o1 === o2;

  constructor(private accountService: AccountService, private accountTypeService: AccountTypeService,
              private subAccountTypeService: SubAccountTypeService, private operationTypeService: OperationTypeService,
              private fb: FormBuilder, private modalService: BsModalService) {
  }

  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get name() {
    return this.form.get("name") as FormControl;
  }

  public get operationType() {
    return this.form.get("operationType") as FormControl;
  }

  public get accountType() {
    return this.form.get("accountType") as FormControl;
  }

  public get subAccountType() {
    return this.form.get("subAccountType") as FormControl;
  }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();
    this.loadAccountTypes();
    this.loadOperationTypes();
    this.loadSubAccountTypes();

    this.accountService.findAll().subscribe(value => this.initializeTable(value));
    this.loadSubAccountTypesByAccountTypeId();
  }

  createForm() {
    this.form = this.fb.group({
      "id": null,
      "name": [null, Validators.required],
      "operationType": [null, Validators.required],
      "accountType": [null, Validators.required],
      "subAccountType": [null, Validators.required]
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      "name": [null, Validators.required],
      "number": null,
      "operationType": null,
      "accountType": null,
      "subAccountType": null
    });
  }

  loadOperationTypes() {
    this.operationTypes$ = this.operationTypeService.findAll();
  }

  loadAccountTypes() {
    this.accountTypes$ = this.accountTypeService.findAll();
  }

  loadSubAccountTypes() {
    this.subAccountTypes$ = this.subAccountTypeService.findAll();
  }

  loadSubAccountTypesByAccountTypeId() {
    this.accountType.valueChanges.subscribe(value => {
      if (value != null)
        this.subAccountTypes$ = this.subAccountTypeService.findAllByAccountTypeId(value.id);
    });
    this.searchForm.get("accountType").valueChanges.subscribe(value => {
      if (value != null)
        this.subAccountTypes$ = this.subAccountTypeService.findAllByAccountTypeId(value.id);
    });
  }

  fillForm(account: Account) {
    this.clearForm();
    this.form.patchValue({
      "id": account.id,
      "name": account.name,
      "operationType": account.operationType,
      "accountType": account.accountType,
      "subAccountType": account.subAccountType
    });
  }

  clearSearchForm() {
    this.searchForm.reset();
    this.loadSubAccountTypes();
    this.accountService.findAll().subscribe(value => this.initializeTable(value));
  }

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  //<editor-fold desc="form getters">

  addAccount(template: TemplateRef<any>) {
    this.validate(["name", "operationType", "accountType", "subAccountType"]);
    if (this.form.valid)
      this.confirmModal = this.modalService.show(template);
  }

  deleteAccount(template: TemplateRef<any>) {
    this.confirmModal = this.modalService.show(template, {class: "modal-sm"});
  }

  onPersistYes() {
    this.accountService.save(this.form.value).subscribe(account => {
      this.clearForm();
      this.accountService.findAll()
        .subscribe(accountList => this.initializeTable(accountList));
      this.closeModal();
    });
  }

  closeModal() {
    this.confirmModal.hide();
  }

  search() {
    this.accountService.search(this.searchForm.value).subscribe(value => this.initializeTable(value));
  }

  //</editor-fold>

  isInvalid(control: FormControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid
    };
  }

  validate(controls: string[]) {
    controls.forEach(control => {
      this.form.get(control).markAsTouched({onlySelf: true});
    });
  }

  private initializeTable(account: Account[]) {
    this.dataSource = new MatTableDataSource(account);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
  }

  private clearForm() {
    this.form.reset();
    this.loadSubAccountTypes();
  }
}
