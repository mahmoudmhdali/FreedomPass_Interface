import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponseBuilderModel} from '../../../shared/models/ResponseBuilder.model';
import {GlobalService} from '../../../shared/services/global.service';
import {UserCompanyPassesService} from '../../../shared/services/database-services/userCompanyPasses.service';

@Component({
  selector: 'app-ngx-company-packages-popup',
  templateUrl: './ngx-company-packages-popup.component.html'
})
export class NgxCompanyPackagesPopupComponent implements OnInit {
  public itemForm: FormGroup;
  disableButton = false;
  apiConfig;
  formIsSubmitted = false;
  companies = [];
  passes = [];

  constructor (
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxCompanyPackagesPopupComponent>,
    private fb: FormBuilder,
    private svcGlobal: GlobalService,
    private snack: MatSnackBar,
    private userCompanyPassesService: UserCompanyPassesService) {
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit () {
    this.buildItemForm(this.data.payload);
    for (const pass of this.data.passes) {
      this.passes.push({value: pass.id.toString(), viewValue: pass.name});
    }
    for (const company of this.data.companies) {
      this.companies.push({value: company.userCompanyInfo.id.toString(), viewValue: company.name});
    }
  }

  buildItemForm (item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      numberOfUsers: [item.numberOfUsers || '', Validators.required],
      userCompanyInfo: ['', Validators.required],
      adminPasses: ['', Validators.required]
    });
  }

  submit () {
    this.disableButton = true;
    const data = this.itemForm.value;
    if (this.data.isNew) {
      this.userCompanyPassesService.addCompanyPass(data).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.disableButton = false;
          if (responseBuilder.code === + this.apiConfig.SUCCESS) {
            this.formIsSubmitted = true;
            this.dialogRef.close(responseBuilder);
            this.snack.open('Company Package Added Successfully', 'OK', {duration: 4000});
          } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
          } else {
            this.snack.open('Error', 'OK', {duration: 4000});
          }
        }
      );
    } else {
    }
  }

  canDeactivate (): boolean {
    return this.formIsSubmitted || ! this.itemForm.dirty;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification () {
    if (! this.canDeactivate()) {
      return confirm('You have unsaved changes! If you leave, your changes will be lost.');
    }
    return true;
  }

  closeDialog () {
    if (! this.canDeactivate()) {
      const userApproval = confirm('You have unsaved changes! If you leave, your changes will be lost.');
      if (userApproval) {
        this.dialogRef.close(false);
      }
      return true;
    }
    this.dialogRef.close(false);
  }
}
