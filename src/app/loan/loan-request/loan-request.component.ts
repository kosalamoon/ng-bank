import {Component, OnInit, TemplateRef} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {Division} from "../../area/model/division";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DivisionService} from "../../area/service/division.service";
import {SocietyService} from "../../area/service/society.service";
import {TeamService} from "../../area/service/team.service";
import {MemberService} from "../../person/service/member.service";
import {LoanService} from "../service/loan.service";
import {Society} from "../../area/model/society";
import {Team} from "../../area/model/team";
import {Member} from "../../person/model/member";
import {integers} from "../../shared/regex/regex";
import {InstallmentScheduleResponse} from "../model/installment-schedule-response";
import {LoanType} from "../model/loan-type";
import {LoanTypeService} from "../service/loan-type.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";

@Component({
  selector: 'app-loan-request',
  templateUrl: './loan-request.component.html',
  styleUrls: ['./loan-request.component.css'],
})
export class LoanRequestComponent implements OnInit {

  form: FormGroup;

  divisions$: Observable<Division[]>;
  societies$: Observable<Society[]>;
  teams$: Observable<Team[]>;
  members$: Observable<Member[]>;
  loanTypes$: Observable<LoanType[]>;

  installmentSchedules$: Observable<InstallmentScheduleResponse[]>;

  division: FormControl = new FormControl(null);
  society: FormControl = new FormControl(null);
  team: FormControl = new FormControl(null);

  confirmModal: BsModalRef;

  constructor(private divisionService: DivisionService,
              private societyService: SocietyService,
              private teamService: TeamService,
              private memberService: MemberService,
              private loanService: LoanService,
              private loanTypeService: LoanTypeService,
              private fb: FormBuilder,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.createForm();
    this.loadDivisions();
    this.loadSocietiesByDivision();
    this.loadTeamsBySocietyId();
    this.loadMembersByTeamId();
    this.loadLoanTypes();

    this.loanType.valueChanges.subscribe(value => {
      if (value) {
        console.log(this.form.controls);
        this.addAmountValidation();
        this.addPeriodValidation();
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      "member": [null, Validators.required],
      "requestedAmount": [null, [Validators.required, Validators.pattern(integers)]],
      "duration": [null, [Validators.required, Validators.pattern(integers)]],
      "loanType": [null, Validators.required],
      "remarks": null,
    });
  }

  clearForm() {
    this.form.reset();
    this.division.reset();
    this.society.reset();
    this.team.reset();
    this.societies$ = this.teams$ = this.members$ = this.installmentSchedules$ = null;
  }

  loadDivisions() {
    this.divisions$ = this.divisionService.findAll();
  }

  loadLoanTypes() {
    this.loanTypes$ = this.loanTypeService.findAll();
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

  getInstallmentSchedule() {
    this.installmentSchedules$ = this.loanService.calculateInstallmentSchedule({
      interestRate: this.loanType.value.interestRate,
      duration: this.duration.value,
      amount: this.requestedAmount.value,
    });
  }

  addLoanRequest(template: TemplateRef<any>) {
    this.validate(["member", "requestedAmount", "duration", "loanType"]);
    if (this.form.valid)
      this.confirmModal = this.modalService.show(template);
  }

  onPersistYes() {
    this.loanService.save(this.form.value).subscribe(value => {
      this.closeModal();
      this.clearForm();
    });
  }

  closeModal() {
    this.confirmModal.hide();
  }

  //<editor-fold desc="form-getters">

  public get member() {
    return this.form.get("member") as FormControl;
  }

  public get requestedAmount() {
    return this.form.get("requestedAmount") as FormControl;
  }

  public get duration() {
    return this.form.get("duration") as FormControl;
  }

  public get loanType() {
    return this.form.get("loanType") as FormControl;
  }

  public get remarks() {
    return this.form.get("remarks") as FormControl;
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

  addAmountValidation() {
    let func = (control: FormControl) =>
      +(this.loanType.value as LoanType).minAmount > (control.value as number) ||
      +(this.loanType.value as LoanType).maxAmount < (control.value as number) ? {"invalidAmount": true} : null;
    this.requestedAmount.setValidators(func.bind(this));
  }

  addPeriodValidation() {
    let func = (control: FormControl) =>
      +(this.loanType.value as LoanType).minPeriod > (control.value as number) ||
      +(this.loanType.value as LoanType).maxPeriod < (control.value as number) ? {"invalidAmount": true} : null;
    this.duration.setValidators(func.bind(this));
  }
}
