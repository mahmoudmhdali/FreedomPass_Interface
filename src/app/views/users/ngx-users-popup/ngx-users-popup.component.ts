import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GlobalService} from '../../../shared/services/global.service';
import {UserService} from '../../../shared/services/database-services/user.service';
import {ResponseBuilderModel} from '../../../shared/models/ResponseBuilder.model';
import {LogsService} from '../../../shared/services/logs.service';
import {TranslatePipe} from '@ngx-translate/core';
import {NgxPermissionsService} from 'ngx-permissions';
import {UserCompanyPassesModel} from '../../../shared/models/UserCompanyPasses.model';

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
  formIsSubmitted = false;
  types = [
    {value: '0', viewValue: 'Admin'},
    {value: '1', viewValue: 'Company'},
    {value: '2', viewValue: 'Outlet'}
  ];
  typeSelected = '0';
  packages: UserCompanyPassesModel[] = [];

  constructor (@Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<NgxUsersPopupComponent>,
               private userService: UserService,
               private logsService: LogsService,
               private ngxPermissionsService: NgxPermissionsService,
               private svcGlobal: GlobalService,
               private snack: MatSnackBar,
               private translatePipe: TranslatePipe,
               private fb: FormBuilder) {
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit () {
    if (typeof this.ngxPermissionsService.getPermission('COMPANY') !== 'undefined') {
      this.packages = this.data.packages;
    }
    if (typeof this.data.viewOnly !== 'undefined') {
      this.disableBoxes = this.data.viewOnly;
    }
    this.buildItemForm(this.data.payload);
    console.log(this.packages);
  }

  buildItemForm (item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      name: [item.name || '', Validators.required],
      email: [item.email || '', [Validators.email, Validators.required]],
      mobileNumber: [item.mobileNumber || '', Validators.required]
    });
    if (typeof this.ngxPermissionsService.getPermission('COMPANY') !== 'undefined') {
      this.itemForm.addControl('packageId', new FormControl('', Validators.required));
      this.itemForm.addControl('isPaid', new FormControl(false, Validators.required));
    }
    if (typeof this.data.viewOnly !== 'undefined' && this.data.viewOnly) {
      let info = '';
      if (item.type.toString() === '1') {
        info = item.userCompanyInfo.info;
      } else if (item.type.toString() === '2') {
        info = item.userOutletInfo.info;
      }
      this.typeChange(item.type.toString(), info);
      if (typeof this.ngxPermissionsService.getPermission('SYSTEM') !== 'undefined' ||
        typeof this.ngxPermissionsService.getPermission('OUR_SYSTEM_USER') !== 'undefined') {
        this.itemForm.addControl('type', new FormControl(item.type.toString() || '', Validators.required));
      }
      this.itemForm.disable();
    }
    if (this.data.isNew) {
      if (typeof this.ngxPermissionsService.getPermission('SYSTEM') !== 'undefined' ||
        typeof this.ngxPermissionsService.getPermission('OUR_SYSTEM_USER') !== 'undefined') {
        this.itemForm.addControl('type', new FormControl('0', Validators.required));
      }
    } else {
      let info = '';
      if (item && item.type) {
        if (item.type.toString() === '1') {
          info = item.userCompanyInfo.info;
          this.typeChange(item.type.toString(), info);
        } else if (item.type.toString() === '2') {
          info = item.userOutletInfo.info;
          this.typeChange(item.type.toString(), info);
        }
      }
    }
  }

  typeChange (type, info) {
    this.typeSelected = type;
    if (type === '0') {
      this.itemForm.removeControl('info');
    } else if (type === '1' || type === '2') {
      this.itemForm.addControl('info', new FormControl(info, Validators.required));
    }
  }

  submit () {
    this.disableButton = true;
    const data = this.itemForm.value;
    if (this.data.isNew) {
      if (typeof this.ngxPermissionsService.getPermission('COMPANY') !== 'undefined') {
        this.userService.addUserUnderCompany(data, this.itemForm.value.packageId, this.itemForm.value.isPaid).subscribe(
          (responseBuilder: ResponseBuilderModel) => {
            this.logsService.setLog('NgxSystemUsersPopupComponent', 'submit(addUser)', responseBuilder);
            this.disableButton = false;
            if (responseBuilder.code === + this.apiConfig.SUCCESS) {
              this.formIsSubmitted = true;
              this.dialogRef.close(responseBuilder.data.user);
              this.snack.open(this.translatePipe.transform('USERADDEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
            } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
              this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
            }
          }
        );
      } else {
        this.userService.addUser(data, 3).subscribe(
          (responseBuilder: ResponseBuilderModel) => {
            this.logsService.setLog('NgxSystemUsersPopupComponent', 'submit(addUser)', responseBuilder);
            this.disableButton = false;
            if (responseBuilder.code === + this.apiConfig.SUCCESS) {
              this.formIsSubmitted = true;
              this.dialogRef.close(responseBuilder.data.user);
              this.snack.open(this.translatePipe.transform('USERADDEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
            } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
              this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
            }
          }
        );
      }
    } else {
      this.userService.updateUser(data).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.logsService.setLog('NgxSystemUsersPopupComponent', 'submit(updateUser)', responseBuilder);
          this.disableButton = false;
          if (responseBuilder.code === + this.apiConfig.SUCCESS) {
            this.formIsSubmitted = true;
            this.dialogRef.close(responseBuilder.data.user);
            this.snack.open(this.translatePipe.transform('USERUPDATEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
          } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
          }
        }
      );
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
