import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatPaginator, MatSelectChange, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {LoanType} from "../model/loan-type";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {LoanTypeService} from "../service/loan-type.service";
import {integers, interest} from "../../shared/regex/regex";

@Component({
  selector: 'app-loan-type',
  templateUrl: './loan-type.component.html',
  styleUrls: ['./loan-type.component.css']
})
export class LoanTypeComponent implements OnInit {

  dataSource: MatTableDataSource<LoanType>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  period: FormControl = new FormControl(null);
  amount: FormControl = new FormControl(null);

  confirmModal: BsModalRef;

  constructor(private loanTypeService: LoanTypeService,
              private fb: FormBuilder,
              private modalService: BsModalService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();
    this.loadLoanTypes();
  }

  createForm() {
    this.form = this.fb.group({
      "id": null,
      "name": [null, Validators.required],
      "interestRate": [null, [Validators.required, Validators.pattern(interest)]],
      "minPeriod": [null, [Validators.required, Validators.pattern(integers)]],
      "maxPeriod": [null, [Validators.required, Validators.pattern(integers)]],
      "minAmount": [null, [Validators.required, Validators.pattern(integers)]],
      "maxAmount": [null, [Validators.required, Validators.pattern(integers)]],
    })
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      "name": null,
      "interestRate": null
    })
  }

  private initializeTable(loanTypes: LoanType[]) {
    this.dataSource = new MatTableDataSource(loanTypes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
  }

  loadLoanTypes() {
    this.loanTypeService.findAll().subscribe(value => {
      this.initializeTable(value);
    });
  }

  fillForm(loanType: LoanType) {
    this.clearForm();
    this.form.patchValue({
      "id": loanType.id,
      "name": loanType.name,
      "interestRate": loanType.interestRate,
      "minPeriod": loanType.minPeriod,
      "maxPeriod": loanType.maxPeriod,
      "minAmount": loanType.minAmount,
      "maxAmount": loanType.maxAmount,
    });
  }

  clearForm() {
    this.form.reset();
  }

  columns: string[] = ["id", "name", "interestRate", "period", "amount", "action"];
  displayedColumns: string[] = ["id", "name", "interestRate", "period", "amount", "action"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  addLoanTypes(template: TemplateRef<any>) {
    this.validate(["name", "interestRate", "minPeriod", "maxPeriod", "minAmount", "maxAmount"]);
    if (this.form.valid)
      this.confirmModal = this.modalService.show(template);
  }

  deleteLoanType(template: TemplateRef<any>) {
    this.confirmModal = this.modalService.show(template, {class: "modal-sm"});
  }

  onPersistYes() {
    this.loanTypeService.save(this.form.value).subscribe(value => {
      this.loadLoanTypes();
      this.clearForm();
      this.closeModal();
      this.openSnackBar(`Loan type having ID ${value.id} persisted successfully`);
    });
  }

  onDeleteYes(id: string) {
    this.loanTypeService.delete(id).subscribe(value => this.loadLoanTypes());
    this.closeModal();
    this.openSnackBar(`Loan Request having ID ${id} deleted successfully`);
  }

  search() {
    this.loanTypeService.search(this.searchForm.value, this.period.value, this.amount.value).subscribe(value => {
      return this.initializeTable(value);
    });
  }

  clearSearchForm() {
    this.loadLoanTypes();
    this.searchForm.reset();
    this.amount.reset();
    this.period.reset();
  }

  closeModal() {
    this.confirmModal.hide();
  }

  validate(controls: string[]) {
    controls.forEach(control => {
      this.form.get(control).markAsTouched({onlySelf: true});
    });
  }

  isInvalid(control: FormControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid
    };
  }

  requiredValidation(control: FormControl) {
    return control.hasError("required") && control.touched;
  }

  //<editor-fold desc="form-getters">

  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get name() {
    return this.form.get("name") as FormControl;
  }

  public get interestRate() {
    return this.form.get("interestRate") as FormControl;
  }

  public get minPeriod() {
    return this.form.get("minPeriod") as FormControl;
  }

  public get maxPeriod() {
    return this.form.get("maxPeriod") as FormControl;
  }

  public get minAmount() {
    return this.form.get("minAmount") as FormControl;
  }

  public get maxAmount() {
    return this.form.get("maxAmount") as FormControl;
  }

  //</editor-fold>

  openSnackBar(message: string) {
    this.snackBar.open(message, "Close");
  }

}
