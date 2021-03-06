import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {StaffService} from "../service/staff.service";
import {MatPaginator, MatSelectChange, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Staff} from "../model/staff";
import {fullName, mobile, nic} from "../../shared/regex/regex";
import {PersonService} from "../service/person.service";
import {ExportService} from "../../shared/print/export.service";

@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  styleUrls: ["./staff.component.css"]
})
export class StaffComponent implements OnInit {

  dataSource: MatTableDataSource<Staff>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  designationList: string[];
  genderList: string[];

  modalRef: BsModalRef;

  isLoading: boolean = false;

  today: Date = new Date();

  constructor(private staffService: StaffService,
              private fb: FormBuilder,
              private personService: PersonService,
              private modalService: BsModalService,
              private exportService: ExportService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();
    this.staffService.findAll().subscribe(staffList => this.initializeTable(staffList));
    this.loadDesignations();
    this.loadGender();

  }

  private createForm() {
    this.form = this.fb.group({
      "id": null,
      "name": [null, [Validators.required, Validators.pattern(fullName)]],
      "address": [null, Validators.required],
      "dob": [null, Validators.required],
      "nic": [null, [Validators.required, Validators.pattern(nic)]],
      "mobile": [null, [Validators.required, Validators.pattern(mobile)]],
      "gender": [null, Validators.required],
      "designation": [null, Validators.required]
    });
  }

  private createSearchForm() {
    this.searchForm = this.fb.group({
      "name": null,
      "designation": null,
      "gender": null
    });
  }

  private initializeTable(staff: Staff[]) {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource(staff);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.isLoading = false;
  }

  private loadDesignations() {
    this.personService.findDesignations().subscribe(value => this.designationList = value);
  }

  private loadGender() {
    this.personService.findGenders().subscribe(value => this.genderList = value);
  }

  compareTableColumns = (o1: any, o2: any) => o1 === o2;

  sortingDataAccessor = (data: Staff, sortHeaderId: string) => {
    switch (sortHeaderId) {
      default:
        return data[sortHeaderId];
    }
  };

  fillForm(staff: Staff) {
    this.clearForm();
    this.form.patchValue({
      "id": staff.id,
      "name": staff.name,
      "address": staff.address,
      "dob": staff.dob,
      "nic": staff.nic,
      "mobile": staff.mobile,
      "gender": staff.gender,
      "designation": staff.designation
    });
  }

  clearForm() {
    this.form.reset();
  }

  columns = ["id", "name", "address", "dob", "nic", "mobile", "gender", "designation", "action"];
  displayedColumns = ["id", "name", "designation", "nic", "action"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  changeDateToString() {
    let value = this.dob.value;
    if (value instanceof Date) {
      let fullDate: string;
      fullDate = value.getFullYear().toString() + "-";

      if (value.getMonth() < 9)
        fullDate += "0" + (value.getMonth() + 1).toString() + "-";
      else
        fullDate += (value.getMonth() + 1).toString() + "-";

      if (value.getDate() < 10)
        fullDate += "0" + (value.getDate()).toString();
      else
        fullDate += value.getDate().toString();

      this.form.patchValue({
        "dob": fullDate
      });
    }
  }

  addStaff(template: TemplateRef<any>) {
    this.validate(["id", "name", "address", "dob", "nic", "mobile", "gender", "designation"]);
    this.changeDateToString();
    if (this.form.valid)
      this.modalRef = this.modalService.show(template);
  }

  deleteStaff(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: "modal-sm"});
  }

  onDeleteYes(id: string) {
    this.staffService.delete(id).subscribe(
      value => this.staffService.findAll().subscribe(staffList => this.initializeTable(staffList))
    );
    this.modalRef.hide();
    this.openSnackBar(`Staff having ID ${id} deleted successfully`);
  }

  onDeleteNo() {
    this.modalRef.hide();
  }

  onPersistYes() {
    this.staffService.save(this.form.value).subscribe(
      value => {
        this.clearForm();
        this.staffService.findAll().subscribe(staffList => this.initializeTable(staffList));
        this.modalRef.hide();
        this.openSnackBar(`Staff having ID ${value.id} persisted successfully`);
      });
  }

  onPersistNo() {
    this.modalRef.hide();
  }

  clearSearch() {
    this.searchForm.reset();
    this.staffService.findAll().subscribe(staffList => this.initializeTable(staffList));
  }

  search() {
    this.staffService.search(this.searchForm.value).subscribe(staff => this.initializeTable(staff));
  }


  //<editor-fold desc="form getters">
  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get name() {
    return this.form.get("name") as FormControl;
  }

  public get address() {
    return this.form.get("address") as FormControl;
  }

  public get dob() {
    return this.form.get("dob") as FormControl;
  }

  public get nic() {
    return this.form.get("nic") as FormControl;
  }

  public get mobile() {
    return this.form.get("mobile") as FormControl;
  }

  public get gender() {
    return this.form.get("gender") as FormControl;
  }

  public get designation() {
    return this.form.get("designation") as FormControl;
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
      this.form.get(control).markAsTouched({onlySelf: true})
    });
  }

  export() {
    this.exportService.exportAsExcelFile(this.dataSource.data, "staff-details");
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Close");
  }
}
