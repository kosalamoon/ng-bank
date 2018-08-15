import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {Division} from "../model/division";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {BsModalService} from "ngx-bootstrap";
import {DivisionService} from "../service/division.service";
import {SocietyService} from "../service/society.service";
import {Society} from "../model/society";

@Component({
  selector: "app-society",
  templateUrl: "./society.component.html",
  styleUrls: ["./society.component.css"]
})
export class SocietyComponent implements OnInit {

  dataSource: MatTableDataSource<Society>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  divisionList: Division[];

  modalRef: BsModalRef;

  myTime: Date;


  isLoading: boolean = false;




  constructor(
    private fb: FormBuilder, private modalService: BsModalService,
    private divisionService: DivisionService, private societyService: SocietyService) {
  }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();
    this.societyService.findAll().subscribe(value => this.initializeTable(value));
    this.loadDivisions();
  }

  private createForm() {
    this.form = this.fb.group({
      'id': null,
      'name': [null, Validators.required],
      'division': [null, Validators.required]
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      'name': null,
      'division': null
    });
  }

  compareTableColumns = (o1: any, o2: any) => o1 === o2;

  sortingDataAccessor = (data: Society, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "division":
        return data.division.id;
      default:
        return data[sortHeaderId];
    }
  };

  private initializeTable(societies: Society[]) {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource(societies);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.isLoading = false;
  }

  columns = ["id", "name", "division", "action"];
  displayedColumns = ["id", "name", "division", "action"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  loadDivisions() {
    this.divisionService.findAll().subscribe(value => this.divisionList = value);
  }

  clearForm() {
    this.form.reset();
  }

  fillForm(society: Society) {
    this.clearForm();
    this.form.patchValue({
      "id": society.id,
      "name": society.name,
      "division": society.division
    });
  }

  clearSearchForm() {
    this.searchForm.reset();
    this.societyService.findAll().subscribe(value => this.initializeTable(value));
  }

  addSociety(template: TemplateRef<any>) {
    this.validate(["id", "name", "division"]);
    if (this.form.valid) {
      this.modalRef = this.modalService.show(template);
    }
  }

  deleteSociety(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: "modal-sm"});
  }

  onPersistYes() {
    this.societyService.save(this.form.value).subscribe(value => {
      this.clearForm();
      this.societyService.findAll()
        .subscribe(divisionList => this.initializeTable(divisionList));
      this.closeModal();
    });
  }

  onDeleteYes(id: string) {
    this.societyService.delete(id)
      .subscribe(value => this.societyService.findAll()
        .subscribe(divisionList => this.initializeTable(divisionList)));
    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
  }

  search() {
    this.societyService.search(this.searchForm.value).subscribe(value => this.initializeTable(value));
  }

  //<editor-fold desc="form getters">

  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get name() {
    return this.form.get("name") as FormControl;
  }

  public get division() {
    return this.form.get("division") as FormControl;
  }

  //</editor-fold>

  isInvalid(control: FormControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid
    };
  }

  compareDropdown = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;

  validate(controls: string[]) {
    controls.forEach(control => {
      this.form.get(control).markAsTouched({onlySelf: true})
    });
  }

}
