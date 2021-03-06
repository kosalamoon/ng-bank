import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SavingsService} from "../service/savings.service";
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {Savings} from "../model/savings";
import {Observable} from "rxjs/internal/Observable";
import {SavingType} from "../model/saving-type";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {SavingTypeService} from "../service/saving-type.service";
import {Division} from "../../area/model/division";
import {Society} from "../../area/model/society";
import {Team} from "../../area/model/team";
import {DivisionService} from "../../area/service/division.service";
import {SocietyService} from "../../area/service/society.service";
import {TeamService} from "../../area/service/team.service";
import {Member} from "../../person/model/member";
import {MemberService} from "../../person/service/member.service";
import {SavingsStatusService} from "../service/saving-status.service";

@Component({
  selector: "app-savings",
  templateUrl: "./savings.component.html",
  styleUrls: ["./savings.component.css"],
})
export class SavingsComponent implements OnInit {

  dataSource: MatTableDataSource<Savings>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  division: FormControl = new FormControl(null);
  society: FormControl = new FormControl(null);
  team: FormControl = new FormControl(null);

  form: FormGroup;
  searchForm: FormGroup;

  savingTypes$: Observable<SavingType[]>;
  savingStatuses$: Observable<string[]>;

  divisions$: Observable<Division[]>;
  societies$: Observable<Society[]>;
  teams$: Observable<Team[]>;
  members$: Observable<Member[]>;

  confirmModal: BsModalRef;


  constructor(private fb: FormBuilder, private savingsService: SavingsService,
              private savingsTypeService: SavingTypeService,
              private savingsStatusService: SavingsStatusService, private divisionService: DivisionService,
              private societyService: SocietyService, private teamService: TeamService,
              private memberService: MemberService, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();
    this.loadSavingsTypes();
    this.loadSavingsStatuses();
    this.loadDivisions();
    this.loadMembers();
    this.loadSavings();

    this.loadSocietiesByDivisionId();
    this.loadTeamsBySocietyId();
    this.loadMembersByTeamId();
  }

  public createForm() {
    this.form = this.fb.group({
      "id": null,
      "savingStatus": ["Active", Validators.required],
      "savingType": [null, Validators.required],
      "account": null,
      "member": [null, Validators.required],
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      "savingStatus": null,
      "savingType": null,
      "account": this.fb.group({
        "number": null,
      }),
      "member": this.fb.group({
        "fullName": null,
      }),
    });
  }

  private loadSavings() {
    this.savingsService.findAll().subscribe(value => {
      this.initializeTable(value);
    });
  }

  private loadSavingsTypes() {
    this.savingTypes$ = this.savingsTypeService.findAll();
  }

  private loadSavingsStatuses() {
    this.savingStatuses$ = this.savingsStatusService.findAll();
  }

  private loadDivisions() {
    this.divisions$ = this.divisionService.findAll();
  }

  loadSocietiesByDivisionId() {
    this.division.valueChanges.subscribe(value => {
      this.society.reset();
      if (value) this.societies$ = this.societyService.findAllByDivisionId(value.id);
    });
  }

  loadTeamsBySocietyId() {
    this.society.valueChanges.subscribe(value => {
      this.team.reset();
      if (value) this.teams$ = this.teamService.findAllBySocietyId(value.id);
    });
  }

  loadMembers() {
    this.members$ = this.memberService.findAll();
  }

  loadMembersByTeamId() {
    this.team.valueChanges.subscribe(value => {
      this.member.reset();
      if (value) this.members$ = this.memberService.findAllByTeamId(value.id);
    });
  }

  private initializeTable(savings: Savings[]) {
    this.dataSource = new MatTableDataSource(savings);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
  }

  fillForm(savings: Savings) {
    this.clearForm();
    this.form.patchValue({
      "id": savings.id,
      "savingStatus": savings.savingStatus,
      "savingType": savings.savingType,
      "account": savings.account,
      "member": savings.member,
    });
  }

  public clearForm() {
    this.form.reset();
    this.savingStatus.reset("Active");
    this.division.reset();
    this.society.reset();
    this.team.reset();
    this.loadMembers();
  }

  sortingDataAccessor = (data: Savings, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "savingType":
        return data.savingType.name;
      case "balance":
        return data.account ? data.account.balance : "";
      case "number":
        return data.account ? data.account.number : "";
      case "member":
        return data.member ? data.member.fullName : "";
      default:
        return data[sortHeaderId];
    }
  };

  columns: string[] = ["id", "savingStatus", "savingType", "balance", "number", "member", "action"];
  displayedColumns: string[] = ["id", "savingStatus", "savingType", "balance", "number", "member", "action"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  addSavings(template: TemplateRef<any>) {
    this.validate(["id", "savingStatus", "savingType", "member"]);
    if (this.id.value == null)
      this.account.patchValue({
        "name": "Saving " + this.member.value.fullName,
        "operationType": "Credit",
        "accountType": {"id": 2},
        "subAccountType": {"id": 8},
      });
    if (this.form.valid)
      this.confirmModal = this.modalService.show(template);
  }

  deleteSavings(template: TemplateRef<any>) {
    this.confirmModal = this.modalService.show(template);
  }

  onPersistYes() {
    this.savingsService.save(this.form.value).subscribe(value => {
      this.loadSavings();
      this.closeModal();
      this.clearForm();
    });
  }

  onDeleteYes(id: string) {
    this.savingsService.delete(id).subscribe(value => {
      this.loadSavings();
      this.closeModal();
    });
  }

  search() {
    this.savingsService.search(this.searchForm.value).subscribe(value => {
      this.initializeTable(value);
    });
  }

  clearSearchForm() {
    this.loadSavings();
    this.searchForm.reset();
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
      "is-valid": control.touched && control.valid,
    };
  }

  requiredValidation(control: FormControl) {
    return control.hasError("required") && control.touched;
  }

  //<editor-fold desc="form-getters">

  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get savingStatus() {
    return this.form.get("savingStatus") as FormControl;
  }

  public get savingType() {
    return this.form.get("savingType") as FormControl;
  }

  public get account() {
    return this.form.get("account") as FormControl;
  }

  public get member() {
    return this.form.get("member") as FormControl;
  }

  //</editor-fold>

  compareDropdown = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;


}
