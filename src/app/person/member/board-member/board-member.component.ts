import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {MatPaginator, MatSelectChange, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BoardMember} from "../../model/board-member";
import {Observable} from "rxjs/internal/Observable";
import {Division} from "../../../area/model/division";
import {Society} from "../../../area/model/society";
import {Team} from "../../../area/model/team";
import {Member} from "../../model/member";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {DivisionService} from "../../../area/service/division.service";
import {SocietyService} from "../../../area/service/society.service";
import {TeamService} from "../../../area/service/team.service";
import {MemberService} from "../../service/member.service";
import {PersonService} from "../../service/person.service";
import {BoardMemberService} from "../../service/board-member.service";

@Component({
  selector: 'app-board-member',
  templateUrl: './board-member.component.html',
  styleUrls: ['./board-member.component.css'],
})
export class BoardMemberComponent implements OnInit {

  dataSource: MatTableDataSource<BoardMember>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  boardDesignations$: Observable<string[]>;
  currentStatuses$: Observable<string[]>;

  divisions$: Observable<Division[]>;
  societies$: Observable<Society[]>;
  teams$: Observable<Team[]>;
  members$: Observable<Member[]>;

  division: FormControl = new FormControl(null);
  society: FormControl = new FormControl(null);
  team: FormControl = new FormControl(null);

  confirmModal: BsModalRef;

  constructor(private divisionService: DivisionService,
              private societyService: SocietyService,
              private teamService: TeamService,
              private memberService: MemberService,
              private boardMemberService: BoardMemberService,
              private personService: PersonService,
              private fb: FormBuilder,
              private modalService: BsModalService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();
    this.loadBoardMembers();
    this.loadBoardDesignations();
    this.loadCurrentStatuses();
    this.loadDivisions();
    this.loadSocietiesByDivision();
    this.loadTeamsBySocietyId();
    this.loadMembersByTeamId();
  }

  createForm() {
    this.form = this.fb.group({
      "id": null,
      "boardDesignation": [null, Validators.required],
      "currentStatus": ["Active", Validators.required],
      "member": [null, Validators.required],
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      "boardDesignation": null,
      "currentStatus": null,
      "member": this.fb.group({
        "fullName": null,
      }),
    });
  }

  private initializeTable(boardMembers: BoardMember[]) {
    this.dataSource = new MatTableDataSource(boardMembers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
  }

  sortingDataAccessor = (data: BoardMember, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "member":
        return data.member ? data.member.fullName : "";
      case "division":
        return data.division ? data.division.name : "";
      default:
        return data[sortHeaderId];
    }
  };

  columns: string[] = ["id", "appointedDate", "boardDesignation", "currentStatus", "member", "division", "action"];
  displayedColumns: string[] = ["id", "appointedDate", "boardDesignation", "currentStatus", "member", "division", "action"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  loadBoardMembers() {
    this.boardMemberService.findAll().subscribe(value => {
      this.initializeTable(value);
    });
  }

  loadBoardDesignations() {
    this.boardDesignations$ = this.personService.findBoardDesignations();
  }

  loadCurrentStatuses() {
    this.currentStatuses$ = this.personService.findCurrentStatuses();
  }

  loadDivisions() {
    this.divisions$ = this.divisionService.findAll();
  }

  loadSocietiesByDivision() {
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

  loadMembersByTeamId() {
    this.team.valueChanges.subscribe(value => {
      this.member.reset();
      if (value) this.members$ = this.memberService.findAllByTeamId(value.id);
    });
  }

  loadMembers() {
    this.members$ = this.memberService.findAll();
  }

  fillForm(boardMember: BoardMember) {
    this.clearForm();
    this.clearExternalCombos();
    this.loadMembers();
    this.form.patchValue({
      "id": boardMember.id,
      "boardDesignation": boardMember.boardDesignation,
      "currentStatus": boardMember.currentStatus,
      "member": boardMember.member,
    })
  }

  clearForm() {
    this.form.reset();
    this.currentStatus.reset("Active");
  }

  clearSearchForm() {
    this.searchForm.reset();
    this.loadBoardMembers();
  }

  clearExternalCombos() {
    this.division.reset();
    this.society.reset();
    this.team.reset();
  }

  addBoardMember(template: TemplateRef<any>) {
    if (this.form.valid) this.confirmModal = this.modalService.show(template);
  }

  deleteBoardMember(template: TemplateRef<any>) {
    if (this.form.valid) this.confirmModal = this.modalService.show(template);
  }

  onPersistYes() {
    this.boardMemberService.save(this.form.value).subscribe(value => {
      this.loadBoardMembers();
      this.closeModal();
      this.openSnackBar(`Board Member having ID ${value.id} persisted successfully`);
    });
  }

  onDeleteYes(id: string) {
    this.boardMemberService.delete(id).subscribe(value => {
      this.loadBoardMembers();
      this.closeModal();
      this.openSnackBar(`Board Member having ID ${id} deleted successfully`);
    });
  }

  search() {
    this.boardMemberService.search(this.searchForm.value).subscribe(value => {
      this.initializeTable(value);
    });
  }

  closeModal() {
    this.confirmModal.hide();
  }


  //<editor-fold desc="form-getters">

  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get boardDesignation() {
    return this.form.get("boardDesignation") as FormControl;
  }

  public get currentStatus() {
    return this.form.get("currentStatus") as FormControl;
  }

  public get member() {
    return this.form.get("member") as FormControl;
  }

  //</editor-fold>

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

  compareDropdown = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;

  openSnackBar(message: string) {
    this.snackBar.open(message, "Close");
  }


}
