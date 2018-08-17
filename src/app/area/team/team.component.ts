import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {Society} from "../model/society";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {Team} from "../model/team";
import {BsModalService} from "ngx-bootstrap";
import {SocietyService} from "../service/society.service";
import {TeamService} from "../service/team.service";
import {Division} from "../model/division";
import {DivisionService} from "../service/division.service";
import {AccountService} from "../../ledger/service/account.service";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
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
    private societyService: SocietyService, private teamService: TeamService, private accountService: AccountService
  ) { }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();
    this.teamService.findAll().subscribe(value => this.initializeTable(value));
    this.loadSocieties();
    this.loadDivisions();
  }

  private createForm() {
    this.form = this.fb.group({
      'id': null,
      'name': [null, Validators.required],
      'society': [null, Validators.required]
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      'name': null,
      'society': null
    });
  }

  compareTableColumns = (o1: any, o2: any) => o1 === o2;

  sortingDataAccessor = (data: Team, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "society":
        return data.society.id;
      default:
        return data[sortHeaderId];
    }
  };

  private initializeTable(teams: Team[]) {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource(teams);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.isLoading = false;
  }

  columns = ["id", "name", "society", "balance", "action"];
  displayedColumns = ["id", "name", "society", "balance", "action"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

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

  clearForm() {
    this.form.reset();
    this.division.reset();
  }

  fillForm(team: Team) {
    this.clearForm();
    this.loadSocieties();
    this.form.patchValue({
      "id": team.id,
      "name": team.name,
      "society": team.society
    });
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
  deleteTeam(template: TemplateRef<any>) {
    this.confirmModal = this.modalService.show(template, {class: "modal-sm"});
  }
  onPersistYes() {
    this.teamService.save(this.form.value).subscribe(team => {
      this.clearForm();
      this.teamService.findAll()
        .subscribe(teamList => this.initializeTable(teamList));
      this.closeModal();
    });
  }

  onPersistYesWithAccount() {
    this.teamService.save(this.form.value).subscribe(team => {
      this.clearForm();
      this.teamService.findAll()
        .subscribe(teamList => this.initializeTable(teamList));
      this.closeModal();

      let account = {
        'name': team.name,
        'operationType': 'Credit',
        'accountType': {'id': 2},
        'subAccountType': {'id': 8},
        'team': {'id': team.id}
      };
      this.accountService.save(account).subscribe(console.log)
    });
  }

  onDeleteYes(id: string) {
    this.teamService.delete(id)
      .subscribe(value => this.teamService.findAll()
        .subscribe(teamList => this.initializeTable(teamList)));
    this.closeModal();
  }
  closeModal() {
    this.confirmModal.hide();
  }
  search() {
    this.teamService.search(this.searchForm.value).subscribe(value => this.initializeTable(value));
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
