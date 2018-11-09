import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {MatPaginator, MatSelectChange, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {Society} from "../model/society";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {Team} from "../model/team";
import {BsModalService} from "ngx-bootstrap";
import {SocietyService} from "../service/society.service";
import {TeamService} from "../service/team.service";
import {Division} from "../model/division";
import {DivisionService} from "../service/division.service";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.css"],
})
export class TeamComponent implements OnInit {

  dataSource: MatTableDataSource<Team>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  societyList: Society[];
  divisionList: Division[];

  confirmModal: BsModalRef;


  isLoading: boolean = false;

  division: FormControl = new FormControl();

  constructor(
    private fb: FormBuilder, private modalService: BsModalService, private divisionService: DivisionService,
    private societyService: SocietyService, private teamService: TeamService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();
    this.teamService.findAll().subscribe(value => this.initializeTable(value));
    this.loadSocieties();
    this.loadDivisions();
  }

  private createForm() {
    this.form = this.fb.group({
      "id": null,
      "name": [null, Validators.required],
      "society": [null, Validators.required],
      "account": null,
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      "name": null,
      "society": null,
    });
  }

  private initializeTable(teams: Team[]) {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource(teams);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.isLoading = false;
  }

  sortingDataAccessor = (data: Team, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "society":
        return data.society.id;
      case "account":
        return data.account.balance;
      default:
        return data[sortHeaderId];
    }
  };

  columns = ["id", "name", "society", "account", "action"];

  displayedColumns = ["id", "name", "society", "account", "action"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  compareTableColumns = (o1: any, o2: any) => o1 === o2;

  loadSocieties() {
    this.societyService.findAll().subscribe(value => this.societyList = value);
  }

  loadDivisions() {
    this.divisionService.findAll().subscribe(value => this.divisionList = value);
  }

  loadSocietiesByDivision() {
    this.societyService.findAllByDivisionId(this.division.value.id).subscribe(value => {
      this.societyList = value;
      this.society.reset();
    });
  }

  fillForm(team: Team) {
    this.clearForm();
    this.loadSocieties();
    this.form.patchValue({
      "id": team.id,
      "name": team.name,
      "society": team.society,
      "account": team.account,
    });
  }

  clearForm() {
    this.form.reset();
    this.division.reset();
  }

  clearSearchForm() {
    this.searchForm.reset();
    this.teamService.findAll().subscribe(value => this.initializeTable(value));
  }

  addTeam(template: TemplateRef<any>) {
    this.validate(["id", "name", "society"]);
    if (this.form.valid)
      this.confirmModal = this.modalService.show(template);
  }

  onPersistYes() {
    if (this.form.value.account == null) {
      this.form.patchValue({
        "account": {
          "name": "Team " + this.name.value,
          "operationType": "Credit",
          "accountType": {"id": 3},
          "subAccountType": {"id": 14},
        },
      });
    }
    this.teamService.save(this.form.value).subscribe(team => {
      this.clearForm();
      this.teamService.findAll()
        .subscribe(teamList => this.initializeTable(teamList));
      this.closeModal();
      this.openSnackBar(`Team having ID '${team.id}' persisted Successfully`);
    });
  }

  deleteTeam(template: TemplateRef<any>) {
    this.confirmModal = this.modalService.show(template, {class: "modal-sm"});
  }

  onDeleteYes(id: string) {
    this.teamService.delete(id)
      .subscribe(value => this.teamService.findAll()
        .subscribe(teamList => this.initializeTable(teamList)));
    this.closeModal();
    this.openSnackBar(`Team having ID '${id}' deleted Successfully`);
  }

  closeModal() {
    this.confirmModal.hide();
  }

  validate(controls: string[]) {
    controls.forEach(control => {
      this.form.get(control).markAsTouched({onlySelf: true});
    });
  }


  search() {
    this.teamService.search(this.searchForm.value).subscribe(value => this.initializeTable(value));
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Close");
  }

  //<editor-fold desc="form getters">

  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get name() {
    return this.form.get("name") as FormControl;
  }

  public get society() {
    return this.form.get("society") as FormControl;
  }

  //</editor-fold>

  isInvalid(control: FormControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid,
    };
  }

  compareDropdown = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;

}
