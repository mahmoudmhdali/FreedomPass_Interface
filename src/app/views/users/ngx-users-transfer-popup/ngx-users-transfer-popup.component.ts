import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GlobalService} from '../../../shared/services/global.service';
import {UserService} from '../../../shared/services/database-services/user.service';
import {LogsService} from '../../../shared/services/logs.service';
import {TranslatePipe} from '@ngx-translate/core';
import {NgxPermissionsService} from 'ngx-permissions';
import {UserProfileModel} from '../../../shared/models/UserProfile.model';
import {UserPassPurchasedService} from '../../../shared/services/database-services/userPassPurchased.service';
import {ResponseBuilderModel} from '../../../shared/models/ResponseBuilder.model';

@Component({
  selector: 'app-ngx-users-popup',
  templateUrl: './ngx-users-transfer-popup.component.html',
  providers: [TranslatePipe]
})
export class NgxUsersTransferPopupComponent implements OnInit {
  public itemForm: FormGroup;
  apiConfig;
  disableButton = false;
  disableBoxes = false;
  formIsSubmitted = false;
  users: UserProfileModel[] = [];
  packages = [];
  loadingPackages = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<NgxUsersTransferPopupComponent>,
              private userService: UserService,
              private logsService: LogsService,
              private ngxPermissionsService: NgxPermissionsService,
              private svcGlobal: GlobalService,
              private snack: MatSnackBar,
              private userPassPurchasedService: UserPassPurchasedService,
              private translatePipe: TranslatePipe,
              private fb: FormBuilder) {
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit() {
    this.users = this.data.companyUsers;
    this.buildItemForm();
  }

  buildItemForm() {
    this.itemForm = this.fb.group({
      user: ['', Validators.required]
    });
  }

  submit() {
    this.disableButton = true;
    const data = this.itemForm.value;
    this.userPassPurchasedService.setTransferPackageToUser(data.user, data.userTo, data.package).subscribe(
      (responseBuilder: ResponseBuilderModel) => {
        this.logsService.setLog('NgxSystemUsersPopupComponent', 'submit(addUser)', responseBuilder);
        this.disableButton = false;
        if (responseBuilder.code === +this.apiConfig.SUCCESS) {
          this.formIsSubmitted = true;
          this.dialogRef.close('Success');
          this.snack.open(this.translatePipe.transform('Package Transfered Successfully'),
            this.translatePipe.transform('OK'), {duration: 4000});
        } else if (responseBuilder.code === +this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
          this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
        }
      }
    );
  }

  userChange(userID) {
    this.loadingPackages = 1;
    this.userPassPurchasedService.getUserPassPurchased(userID).subscribe(
      (responseBuilder) => {
        this.logsService.setLog('AppUsersComponent', 'ngOnInit(getUsers)', responseBuilder);
        if (responseBuilder.code === +this.apiConfig.SUCCESS) {
          this.loadingPackages = 2;
          this.packages = responseBuilder.data.userPassPurchaseds;
          console.log(this.packages);
          if (this.packages.length > 0) {
            this.itemForm.addControl('package', new FormControl('', Validators.required));
            this.itemForm.addControl('userTo', new FormControl('', Validators.required));
          }
        }
      }
    );
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
