import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GlobalService} from '../../../shared/services/global.service';
import {UserService} from '../../../shared/services/database-services/user.service';
import {ResponseBuilderModel} from '../../../shared/models/ResponseBuilder.model';
import {CustomValidators} from 'ng2-validation';
import {LogsService} from '../../../shared/services/logs.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-ngx-users-popup',
  templateUrl: './ngx-users-popup.component.html',
  providers: [TranslatePipe]
})
export class NgxUsersPopupComponent implements OnInit {
  public itemForm: FormGroup;
  apiConfig;
  disableButton = false;
  disableBoxes = false;
  hidePassword = true;
  hideConfirmPassword = true;
  formIsSubmitted = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<NgxUsersPopupComponent>,
              private userService: UserService,
              private logsService: LogsService,
              private svcGlobal: GlobalService,
              private snack: MatSnackBar,
              private translatePipe: TranslatePipe,
              private fb: FormBuilder) {
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit() {
    if (typeof this.data.viewOnly !== 'undefined') {
      this.disableBoxes = this.data.viewOnly;
    }
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      name: [item.name || '', Validators.required],
      email: [item.email || '', [Validators.email, Validators.required]],
      jobTitle: [item.jobTitle || '', Validators.required],
      mobileNumber: [item.mobileNumber || '', Validators.required],
      enabled: [item.enabled || false]
    });
    if (typeof this.data.viewOnly !== 'undefined' && this.data.viewOnly) {
      this.itemForm.disable();
    }
    if (this.data.isNew) {
      const newPassword = new FormControl(item.newPassword, Validators.required);
      const confirmPassword = new FormControl(item.confirmPassword, [Validators.required, CustomValidators.equalTo(newPassword)]);
      this.itemForm.addControl('newPassword', newPassword);
      this.itemForm.addControl('confirmPassword', confirmPassword);
    }
  }

  submit() {
    this.disableButton = true;
    const data = this.itemForm.value;
    if (this.data.isNew) {
      this.userService.addUser(data).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.logsService.setLog('NgxUsersPopupComponent', 'submit(addUser)', responseBuilder);
          this.disableButton = false;
          if (responseBuilder.code === +this.apiConfig.SUCCESS) {
            this.formIsSubmitted = true;
            this.dialogRef.close(responseBuilder.data.user);
            this.snack.open(this.translatePipe.transform('USERADDEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
          } else if (responseBuilder.code === +this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
          }
        }
      );
    } else {
      this.userService.updateUser(data).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.logsService.setLog('NgxUsersPopupComponent', 'submit(updateUser)', responseBuilder);
          this.disableButton = false;
          if (responseBuilder.code === +this.apiConfig.SUCCESS) {
            this.formIsSubmitted = true;
            this.dialogRef.close(responseBuilder.data.user);
            this.snack.open(this.translatePipe.transform('USERUPDATEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
          } else if (responseBuilder.code === +this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
          }
        }
      );
    }
  }

  canDeactivate(): boolean {
    return this.formIsSubmitted || !this.itemForm.dirty;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification() {
    if (!this.canDeactivate()) {
      return confirm('You have unsaved changes! If you leave, your changes will be lost.');
    }
    return true;
  }

  closeDialog() {
    if (!this.canDeactivate()) {
      const userApproval = confirm('You have unsaved changes! If you leave, your changes will be lost.');
      if (userApproval) {
        this.dialogRef.close(false);
      }
      return true;
    }
    this.dialogRef.close(false);
  }
}
