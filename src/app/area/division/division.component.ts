import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BoardMemberService} from "../../person/service/board-member.service";
import {StaffService} from "../../person/service/staff.service";
import {BsModalService} from "ngx-bootstrap";
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {Division} from "../model/division";
import {BsModalRef} from "ngx-bootstrap/modal";
import {BoardMember} from "../../person/model/board-member";
import {Staff} from "../../person/model/staff";
import {DivisionService} from "../service/division.service";

@Component({
  selector: "app-division",
  templateUrl: "./division.component.html",
  styleUrls: ["./division.component.css"]
})
export class DivisionComponent implements OnInit {

  dataSource: MatTableDataSource<Division>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  boardMemberList: BoardMember[] = [];
  staffList: Staff[] = [];

  modalRef: BsModalRef;

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, private modalService: BsModalService, private divisionService: DivisionService,
    private boardMemberService: BoardMemberService, private staffService: StaffService) {
  }

  ngOnInit() {
    this.createDivisionForm();
    this.createSearchForm();
    this.divisionService.findAll().subscribe(value => this.initializeTable(value));
    this.loadStaff();
    this.loadBoardMembers();
  }

  private createDivisionForm() {
    this.form = this.fb.group({
      "id": null,
      "name": [null, Validators.required],
      "boardMember": [null, Validators.required],
      "staff": [null, Validators.required]
    });
  }

  private createSearchForm() {
    this.searchForm = this.fb.group({
      "name": null,
      "boardMember": null,
      "staff": null
    });
  }

  compareTableColumns = (o1: any, o2: any) => o1 === o2;

  sortingDataAccessor = (data: Division, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "boardMember":
        return data.boardMember.id;
      case "staff":
        return data.staff.id;
      default:
        return data[sortHeaderId];
    }
  };

  private initializeTable(division: Division[]) {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource(division);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.isLoading = false;
  }

  columns = ["id", "name", "boardMember", "staff", "action"];
  displayedColumns = ["id", "name", "boardMember", "staff", "action"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  loadBoardMembers() {
    this.boardMemberService.findAll().subscribe(boardMembers => this.boardMemberList = boardMembers);
  }

  loadStaff() {
    this.staffService.findAll().subscribe(staffs => this.staffList = staffs);
  }

  fillForm(division: Division) {
    this.clearForm();
    this.form.patchValue({
      "id": division.id,
      "name": division.name,
      "boardMember": division.boardMember,
      "staff": division.staff
    });
  }

  clearForm() {
    this.form.reset();
  }

  clearSearchForm() {
    this.searchForm.reset();
    this.divisionService.findAll().subscribe(value => this.initializeTable(value));
  }

  addDivision(template: TemplateRef<any>) {
    this.validate(["id", "name", "boardMember", "staff"]);
    if (this.form.valid) {
      this.modalRef = this.modalService.show(template);
    }
  }

  deleteDivision(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: "modal-sm"});
  }

  onPersistYes() {
    this.divisionService.save(this.form.value).subscribe(value => {
      this.clearForm();
      this.divisionService.findAll()
        .subscribe(divisionList => this.initializeTable(divisionList));
      this.closeModal();
      this.loadStaff();
      this.loadBoardMembers();
    });
  }

  onDeleteYes(id: string) {
    this.divisionService.delete(id)
      .subscribe(value => this.divisionService.findAll()
        .subscribe(divisionList => this.initializeTable(divisionList)));
    this.closeModal();
    this.loadStaff();
    this.loadBoardMembers();
  }

  closeModal() {
    this.modalRef.hide();
  }

  search() {
    this.divisionService.search(this.searchForm.value).subscribe(value => {
      this.initializeTable(value);
    });

  }

  //<editor-fold desc="form getters">

  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get name() {
    return this.form.get("name") as FormControl;
  }

  public get boardMember() {
    return this.form.get("boardMember") as FormControl;
  }

  public get staff() {
    return this.form.get("staff") as FormControl;
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



