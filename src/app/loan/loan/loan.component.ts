import {Component, OnInit, ViewChild} from "@angular/core";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Loan} from "../model/loan";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/internal/Observable";
import {LoanType} from "../model/loan-type";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Division} from "../../area/model/division";
import {Society} from "../../area/model/society";
import {Team} from "../../area/model/team";
import {Member} from "../../person/model/member";
import {DivisionService} from "../../area/service/division.service";
import {SocietyService} from "../../area/service/society.service";
import {TeamService} from "../../area/service/team.service";
import {MemberService} from "../../person/service/member.service";
import {LoanService} from "../service/loan.service";
import {LoanTypeService} from "../service/loan-type.service";

@Component({
  selector: "app-loan",
  templateUrl: "./loan.component.html",
  styleUrls: ["./loan.component.css"]
})
export class LoanComponent implements OnInit {

  dataSource: MatTableDataSource<Loan>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  division: FormControl = new FormControl(null);
  society: FormControl = new FormControl(null);
  team: FormControl = new FormControl(null);

  loanTypes$: Observable<LoanType[]>;

  divisions$: Observable<Division[]>;
  societies$: Observable<Society[]>;
  teams$: Observable<Team[]>;
  members$: Observable<Member[]>;

  confirmModal: BsModalRef;


  constructor(private fb: FormBuilder, private loanService: LoanService,
              private loanTypeSerice: LoanTypeService, private divisionService: DivisionService,
              private societyService: SocietyService, private teamService: TeamService,
              private memberService: MemberService, private modalService: BsModalService) {
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.fb.group({
      "id": null,
      "loanType": [null, Validators.required],
      "requestedAmount": [null, Validators.required],
      "remarks": null,
      "account": [null, Validators.required],
      "member": [null, Validators.required]
    });
  }

  private initializeTable(savings: Loan[]) {
    this.dataSource = new MatTableDataSource(savings);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
  }

  sortingDataAccessor = (data: Loan, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "loanType":
        return data.loanType.name;
      case "number":
        return data.account ? data.account.number : "";
      case "balance":
        return data.account ? data.account.balance : "";
      case "member":
        return data.member ? data.member.fullName : "";
      default:
        return data[sortHeaderId];
    }
  };

  loadLoans() {
    this.loanService.findAll().subscribe(value => {
      this.initializeTable(value);
    });
  }

  loadLoanTypes() {
    this.loanTypes$ = this.loanTypeSerice.findAll();
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
      //this.member.reset();
      if (value) this.members$ = this.memberService.findAllByTeamId(value.id);
    });
  }

}
