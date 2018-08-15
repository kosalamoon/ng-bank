import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Member} from "../model/member";
import {Team} from "../../area/model/team";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MemberService} from "../service/member.service";
import {TeamService} from "../../area/service/team.service";
import {fullName, mobile, nic} from "../../md-components/regex/regex";
import {Observable} from "rxjs/internal/Observable";
import {IncomeTypeService} from "../service/income-type.service";
import {GenderService} from "../service/gender.service";
import {SubsidyTypeService} from "../service/subsidy-type.service";
import {DivisionService} from "../../area/service/division.service";
import {SocietyService} from "../../area/service/society.service";
import {Division} from "../../area/model/division";
import {Society} from "../../area/model/society";

@Component({
  selector: "app-member",
  templateUrl: "./member.component.html",
  styleUrls: ["./member.component.css"]
})
export class MemberComponent implements OnInit {

  dataSource: MatTableDataSource<Member>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  subsidy: FormControl = new FormControl(false);

  division: FormControl = new FormControl(null);
  society: FormControl = new FormControl(null);


  divisions$: Observable<Division[]>;
  societies$: Observable<Society[]>;


  incomeTypes$: Observable<string[]>;
  subsidyTypes$: Observable<string[]>;
  teams$: Observable<Team[]>;
  genders$: Observable<string[]>;

  modalRef: BsModalRef;
  isLoading: boolean = false;


  constructor(private memberService: MemberService, private teamService: TeamService,
              private fb: FormBuilder, private modalService: BsModalService,
              private incomeTypeService: IncomeTypeService, private genderService: GenderService,
              private subsidyTypeService: SubsidyTypeService, private divisionService: DivisionService,
              private societyService: SocietyService) {
  }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();

    this.subsidy.valueChanges.subscribe(value => this.addSubsidyToForm(value));

    this.loadTeams();
    this.loadIncomeTypes();
    this.loadGenders();
    this.loadSubsidyTypes();
    this.loadDivisions();

    this.division.valueChanges.subscribe(value => this.loadSocietiesByDivision(value.id));
    this.society.valueChanges.subscribe(value => this.loadTeamsBySociety(value.id));

    this.memberService.findAll().subscribe(value => this.initializeTable(value));
  }

  private addSubsidyToForm(value) {
    if (value) {
      this.form.removeControl("subsidy");
      this.form.addControl("subsidy", this.fb.group({
        "id": null,
        "subsidyType": [null, Validators.required],
        "amount": [null, Validators.required],
        "number": [null, Validators.required]
      }));
    } else
      this.form.removeControl("subsidy");
  }

  private removeSubsidyFromForm() {
    this.subsidy.patchValue(false);
    this.form.removeControl("subsidy");
  }

  private createForm() {
    this.form = this.fb.group({
      "id": null,
      "fullName": [null, [Validators.required, Validators.pattern(fullName)]],
      "address": [null, Validators.required],
      "nic": [null, [Validators.required, Validators.pattern(nic)]],
      "dob": [null, Validators.required],
      "gender": [null, Validators.required],
      "telephone": [null, [Validators.required, Validators.pattern(mobile)]],
      "spouse": null,
      "incomeType": [null, Validators.required],
      "team": [null, Validators.required]
    });


  }

  private createSearchForm() {
    this.searchForm = this.fb.group({
      "fullName": null,
      "dob": null,
      "incomeType": null,
      "subsidy": this.fb.group({
        "subsidyType": null
      }),
      "team": null
    });
  }

  private initializeTable(members: Member[]) {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource(members);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.isLoading = false;
  }

  loadTeams() {
    this.teams$ = this.teamService.findAll();
  }

  loadIncomeTypes() {
    this.incomeTypes$ = this.incomeTypeService.findAll();
  }

  loadGenders() {
    this.genders$ = this.genderService.findAll();
  }

  loadSubsidyTypes() {
    this.subsidyTypes$ = this.subsidyTypeService.findAll();
  }

  loadDivisions() {
    this.divisions$ = this.divisionService.findAll();
  }

  loadSocietiesByDivision(id: string) {
    this.societies$ = this.societyService.findAllByDivisionId(id);
  }

  loadTeamsBySociety(id: string) {
    this.teams$ = this.teamService.findAllBySocietyId(id);
  }



  sortingDataAccessor = (data: Member, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "team":
        return data.team.name;
      case "subsidyType":
        return data.subsidy ? data.subsidy.subsidyType : "";
      case "amount":
        return data.subsidy ? data.subsidy.amount : "";
      case "number":
        return data.subsidy ? data.subsidy.number : "";
      default:
        return data[sortHeaderId];
    }
  };

  fillForm(member: Member) {
    this.clearForm();
    if (member.subsidy != null) {
      this.subsidy.patchValue(true);
      this.form.patchValue({
        "id": member.id,
        "fullName": member.fullName,
        "address": member.address,
        "nic": member.nic,
        "dob": member.dob,
        "gender": member.gender,
        "telephone": member.telephone,
        "spouse": member.spouse,
        "incomeType": member.incomeType,
        "subsidy": {
          "id": member.subsidy.id,
          "subsidyType": member.subsidy.subsidyType,
          "amount": member.subsidy.amount,
          "number": member.subsidy.number
        },
        "team": member.team
      });
    } else {
      this.removeSubsidyFromForm();
      this.form.patchValue({
        "id": member.id,
        "fullName": member.fullName,
        "address": member.address,
        "nic": member.nic,
        "dob": member.dob,
        "gender": member.gender,
        "telephone": member.telephone,
        "spouse": member.spouse,
        "incomeType": member.incomeType,
        "team": member.team
      });
    }
  }

  clearForm() {
    this.form.reset();
    this.removeSubsidyFromForm();
    this.clearExternalCombos();
  }

  clearExternalCombos() {
    this.division.reset();
    this.society.reset();
  }

  columns: string[] = ["id", "fullName", "address", "nic", "dob", "gender", "telephone", "spouse", "incomeType",
    "subsidyType", "amount", "number", "team", "action"];
  displayedColumns: string[] = ["id", "fullName", "incomeType", "subsidyType", "team", "action"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  addMember(template: TemplateRef<any>) {
    this.form.patchValue({
      "dob": this.convertDateToString(this.dob.value)
    });
    this.validate(["fullName", "address", "nic", "dob", "gender", "telephone", "spouse", "incomeType", "team",
      "subsidy.subsidyType", "subsidy.amount", "subsidy.number"]);
    if (this.form.valid)
      this.modalRef = this.modalService.show(template);
  }

  deleteMember(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: "modal-sm"});
  }

  onDeleteYes(id: string) {
    this.memberService.delete(id).subscribe(
      value => this.memberService.findAll().subscribe(meetingList => this.initializeTable(meetingList))
    );
    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
  }

  onPersistYes() {
    console.log(this.form.value);
    this.memberService.save(this.form.value).subscribe(
      value => {
        this.clearForm();
        this.memberService.findAll().subscribe(meetingList => this.initializeTable(meetingList));
        this.closeModal();
      });
  }

  search() {
    setTimeout(() => {
      this.searchForm.patchValue({
        "dob": this.convertDateToString(this.searchForm.get("dob").value)
      });
      this.memberService.search(this.searchForm.value).subscribe(value => this.initializeTable(value));
    }, 100);

  }

  clearSearch() {
    this.searchForm.reset();
    this.memberService.findAll().subscribe(meetingList => this.initializeTable(meetingList));
  }

  //<editor-fold desc="form getters">

  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get fullName() {
    return this.form.get("fullName") as FormControl;
  }

  public get address() {
    return this.form.get("address") as FormControl;
  }

  public get nic() {
    return this.form.get("nic") as FormControl;
  }

  public get dob() {
    return this.form.get("dob") as FormControl;
  }

  public get gender() {
    return this.form.get("gender") as FormControl;
  }

  public get telephone() {
    return this.form.get("telephone") as FormControl;
  }

  public get spouse() {
    return this.form.get("spouse") as FormControl;
  }

  public get subsidyFormGroup() {
    return this.form.get("subsidy") as FormGroup;
  }

  public get incomeType() {
    return this.form.get("incomeType") as FormControl;
  }

  public get subsidyId() {
    return this.form.get("subsidy.id") as FormControl;
  }

  public get subsidyType() {
    return this.form.get("subsidy.subsidyType") as FormControl;
  }

  public get amount() {
    return this.form.get("subsidy.amount") as FormControl;
  }

  public get number() {
    return this.form.get("subsidy.number") as FormControl;
  }

  public get team() {
    return this.form.get("team") as FormControl;
  }

  //</editor-fold>


  convertDateToString(value): string {
    if (value instanceof Date) {
      let fullDate: string;
      fullDate = value.getFullYear().toString() + "-";
      fullDate += value.getMonth() < 9 ? "0" + (value.getMonth() + 1).toString() + "-" : (value.getMonth() + 1).toString() + "-";
      fullDate += value.getDate() < 10 ? "0" + (value.getDate()).toString() : value.getDate().toString();
      return fullDate;
    }
    else
      return value;
  }

  isInvalid(control: FormControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid
    };
  }

  compareDropdown = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;

  compareTableColumns = (o1: any, o2: any) => o1 === o2;

  validate(controls: string[]) {
    controls.forEach(control => {
      this.form.get(control).markAsTouched({onlySelf: true});
    });
  }


}
