import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserProfileModel} from '../../shared/models/UserProfile.model';
import {UserSettingsService} from '../../shared/services/database-services/userSettings.service';
import {GlobalService} from '../../shared/services/global.service';
import {LogsService} from '../../shared/services/logs.service';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {FormCanDeactivate} from '../../shared/components/can-deactivate/form-can-deactivate/form-can-deactivate';
import {ResponseBuilderModel} from '../../shared/models/ResponseBuilder.model';
import {MatSnackBar} from '@angular/material';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LayoutService} from '../../shared/services/layout.service';
import {CustomValidators} from 'ng2-validation';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {AppLoaderService} from '../../shared/services/app-loader/app-loader.service';
import {NgxPermissionsService} from 'ngx-permissions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  providers: [TranslatePipe]
})
export class ProfileComponent extends FormCanDeactivate implements OnInit {
  @ViewChild('form')
  form: NgForm;
  user: UserProfileModel;
  modelLoaded = 0;
  apiConfig;
  public itemForm: FormGroup;
  public passwordForm: FormGroup;
  disableButton = false;
  hidePassword = true;
  hideConfirmPassword = true;
  hideNewPassword = true;
  @ViewChild('fileInput1')
  fileInput1: ElementRef;
  @ViewChild('fileInput2')
  fileInput2: ElementRef;
  @ViewChild('fileInput3')
  fileInput3: ElementRef;
  @ViewChild('fileInput4')
  fileInput4: ElementRef;
  public imagesForm: FormGroup;
  fileList1 = [];
  fileList2 = [];
  fileList3 = [];
  fileList4 = [];
  imageName1 = '';
  imageName2 = '';
  imageName3 = '';
  imageName4 = '';
  public locationsForm: FormGroup;

  constructor (private userSettingsService: UserSettingsService,
               private svcGlobal: GlobalService,
               private snack: MatSnackBar,
               private translatePipe: TranslatePipe,
               private loader: AppLoaderService,
               public translate: TranslateService,
               private ngxPermissionsService: NgxPermissionsService,
               private logsService: LogsService,
               private layout: LayoutService,
               private fb: FormBuilder) {
    super();
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit () {
    forkJoin([this.userSettingsService.getUser()])
      .subscribe(responses => {
        this.logsService.setLog('AddAlarmComponent', 'ngOnInit(getAlarmLevels)', responses[0]);
        if (responses[0].code === + this.apiConfig.SUCCESS) {
          this.user = responses[0].data.user;
          this.buildItemForm();
          this.modelLoaded ++;
        }
      });
  }

  buildItemForm () {
    const newPassword = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(newPassword)]);
    this.passwordForm = this.fb.group({
      password: ['', Validators.required]
    });
    this.passwordForm.addControl('newPassword', newPassword);
    this.passwordForm.addControl('confirmPassword', confirmPassword);
    this.itemForm = this.fb.group({
      name: [this.user.name || '', Validators.required],
      email: [{value: this.user.email, disabled: true}, Validators.required],
      mobileNumber: [this.user.mobileNumber || '', Validators.required]
    });
    if (typeof this.ngxPermissionsService.getPermission('OUTLET') !== 'undefined') {
      const index1: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoImagesCollection.indexOf(
        this.user.userOutletInfo.userOutletInfoImagesCollection.find(image => image.imageIndex === 1)) : - 1;
      const index2: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoImagesCollection.indexOf(
        this.user.userOutletInfo.userOutletInfoImagesCollection.find(image => image.imageIndex === 2)) : - 1;
      const index3: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoImagesCollection.indexOf(
        this.user.userOutletInfo.userOutletInfoImagesCollection.find(image => image.imageIndex === 3)) : - 1;
      const index4: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoImagesCollection.indexOf(
        this.user.userOutletInfo.userOutletInfoImagesCollection.find(image => image.imageIndex === 4)) : - 1;
      this.imagesForm = this.fb.group({
        imageName1: [index1 < 0 ? '' : this.user.userOutletInfo.userOutletInfoImagesCollection[index1].fileName || ''],
        imageName2: [index2 < 0 ? '' : this.user.userOutletInfo.userOutletInfoImagesCollection[index2].fileName || ''],
        imageName3: [index3 < 0 ? '' : this.user.userOutletInfo.userOutletInfoImagesCollection[index3].fileName || ''],
        imageName4: [index4 < 0 ? '' : this.user.userOutletInfo.userOutletInfoImagesCollection[index4].fileName || '']
      });
      const index11: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoLocationsCollection.indexOf(
        this.user.userOutletInfo.userOutletInfoLocationsCollection.find(location => location.locationIndex === 1)) : - 1;
      const index22: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoLocationsCollection.indexOf(
        this.user.userOutletInfo.userOutletInfoLocationsCollection.find(location => location.locationIndex === 2)) : - 1;
      const index33: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoLocationsCollection.indexOf(
        this.user.userOutletInfo.userOutletInfoLocationsCollection.find(location => location.locationIndex === 3)) : - 1;
      const index44: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoLocationsCollection.indexOf(
        this.user.userOutletInfo.userOutletInfoLocationsCollection.find(location => location.locationIndex === 4)) : - 1;
      this.locationsForm = this.fb.group({
        longitude1: [index11 < 0 ? '' : this.user.userOutletInfo.userOutletInfoLocationsCollection[index11].longitude || ''],
        latitude1: [index11 < 0 ? '' : this.user.userOutletInfo.userOutletInfoLocationsCollection[index11].latitude || ''],
        longitude2: [index22 < 0 ? '' : this.user.userOutletInfo.userOutletInfoLocationsCollection[index22].longitude || ''],
        latitude2: [index22 < 0 ? '' : this.user.userOutletInfo.userOutletInfoLocationsCollection[index22].latitude || ''],
        longitude3: [index33 < 0 ? '' : this.user.userOutletInfo.userOutletInfoLocationsCollection[index33].longitude || ''],
        latitude3: [index33 < 0 ? '' : this.user.userOutletInfo.userOutletInfoLocationsCollection[index33].latitude || ''],
        longitude4: [index44 < 0 ? '' : this.user.userOutletInfo.userOutletInfoLocationsCollection[index44].longitude || ''],
        latitude4: [index44 < 0 ? '' : this.user.userOutletInfo.userOutletInfoLocationsCollection[index44].latitude || ''],
      });
    } else if (typeof this.ngxPermissionsService.getPermission('COMPANY') !== 'undefined') {
      const index1: number = this.user.userCompanyInfo !== undefined ? this.user.userCompanyInfo.userCompanyInfoImagesCollection.indexOf(
        this.user.userCompanyInfo.userCompanyInfoImagesCollection.find(image => image.imageIndex === 1)) : - 1;
      const index2: number = this.user.userCompanyInfo !== undefined ? this.user.userCompanyInfo.userCompanyInfoImagesCollection.indexOf(
        this.user.userCompanyInfo.userCompanyInfoImagesCollection.find(image => image.imageIndex === 2)) : - 1;
      const index3: number = this.user.userCompanyInfo !== undefined ? this.user.userCompanyInfo.userCompanyInfoImagesCollection.indexOf(
        this.user.userCompanyInfo.userCompanyInfoImagesCollection.find(image => image.imageIndex === 3)) : - 1;
      const index4: number = this.user.userCompanyInfo !== undefined ? this.user.userCompanyInfo.userCompanyInfoImagesCollection.indexOf(
        this.user.userCompanyInfo.userCompanyInfoImagesCollection.find(image => image.imageIndex === 4)) : - 1;
      this.imagesForm = this.fb.group({
        imageName1: [index1 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoImagesCollection[index1].fileName || ''],
        imageName2: [index2 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoImagesCollection[index2].fileName || ''],
        imageName3: [index3 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoImagesCollection[index3].fileName || ''],
        imageName4: [index4 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoImagesCollection[index4].fileName || '']
      });
      const index11: number = this.user.userCompanyInfo !== undefined ?
        this.user.userCompanyInfo.userCompanyInfoLocationsCollection.indexOf(
          this.user.userCompanyInfo.userCompanyInfoLocationsCollection.find(location => location.locationIndex === 1)) : - 1;
      const index22: number = this.user.userCompanyInfo !== undefined ?
        this.user.userCompanyInfo.userCompanyInfoLocationsCollection.indexOf(
          this.user.userCompanyInfo.userCompanyInfoLocationsCollection.find(location => location.locationIndex === 2)) : - 1;
      const index33: number = this.user.userCompanyInfo !== undefined ?
        this.user.userCompanyInfo.userCompanyInfoLocationsCollection.indexOf(
          this.user.userCompanyInfo.userCompanyInfoLocationsCollection.find(location => location.locationIndex === 3)) : - 1;
      const index44: number = this.user.userCompanyInfo !== undefined ?
        this.user.userCompanyInfo.userCompanyInfoLocationsCollection.indexOf(
          this.user.userCompanyInfo.userCompanyInfoLocationsCollection.find(location => location.locationIndex === 4)) : - 1;
      this.locationsForm = this.fb.group({
        longitude1: [index11 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoLocationsCollection[index11].longitude || ''],
        latitude1: [index11 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoLocationsCollection[index11].latitude || ''],
        longitude2: [index22 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoLocationsCollection[index22].longitude || ''],
        latitude2: [index22 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoLocationsCollection[index22].latitude || ''],
        longitude3: [index33 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoLocationsCollection[index33].longitude || ''],
        latitude3: [index33 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoLocationsCollection[index33].latitude || ''],
        longitude4: [index44 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoLocationsCollection[index44].longitude || ''],
        latitude4: [index44 < 0 ? '' : this.user.userCompanyInfo.userCompanyInfoLocationsCollection[index44].latitude || ''],
      });
    }
  }

  image1FileChange (e) {
    this.disableButton = false;
    this.fileList1 = e.target.files;
    if (e.target.files.length === 0) {
      if (typeof this.ngxPermissionsService.getPermission('OUTLET') !== 'undefined') {
        const index1: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoImagesCollection.indexOf(
          this.user.userOutletInfo.userOutletInfoImagesCollection.find(image => image.imageIndex === 1)) : - 1;
        this.imagesForm.controls['imageName1'].setValue(index1 < 0 ?
          '' : this.user.userOutletInfo.userOutletInfoImagesCollection[index1].fileName || '');
      } else if (typeof this.ngxPermissionsService.getPermission('COMPANY') !== 'undefined') {
        const index1: number = this.user.userCompanyInfo !== undefined ? this.user.userCompanyInfo.userCompanyInfoImagesCollection.indexOf(
          this.user.userCompanyInfo.userCompanyInfoImagesCollection.find(image => image.imageIndex === 1)) : - 1;
        this.imagesForm.controls['imageName1'].setValue(index1 < 0 ?
          '' : this.user.userCompanyInfo.userCompanyInfoImagesCollection[index1].fileName || '');
      }
    } else {
      this.imagesForm.controls['imageName1'].setValue(e.target.files[0].name);
      this.imageName1 = e.target.files[0].name;
    }
    this.imagesForm.markAsDirty();
  }

  image2FileChange (e) {
    this.disableButton = false;
    this.fileList2 = e.target.files;
    if (e.target.files.length === 0) {
      if (typeof this.ngxPermissionsService.getPermission('OUTLET') !== 'undefined') {
        const index2: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoImagesCollection.indexOf(
          this.user.userOutletInfo.userOutletInfoImagesCollection.find(image => image.imageIndex === 2)) : - 1;
        this.imagesForm.controls['imageName2'].setValue(index2 < 0 ?
          '' : this.user.userOutletInfo.userOutletInfoImagesCollection[index2].fileName || '');
      } else if (typeof this.ngxPermissionsService.getPermission('COMPANY') !== 'undefined') {
        const index2: number = this.user.userCompanyInfo !== undefined ? this.user.userCompanyInfo.userCompanyInfoImagesCollection.indexOf(
          this.user.userCompanyInfo.userCompanyInfoImagesCollection.find(image => image.imageIndex === 2)) : - 1;
        this.imagesForm.controls['imageName2'].setValue(index2 < 0 ?
          '' : this.user.userCompanyInfo.userCompanyInfoImagesCollection[index2].fileName || '');
      }
    } else {
      this.imagesForm.controls['imageName2'].setValue(e.target.files[0].name);
      this.imageName2 = e.target.files[0].name;
    }
    this.imagesForm.markAsDirty();
  }

  image3FileChange (e) {
    this.disableButton = false;
    this.fileList3 = e.target.files;
    if (e.target.files.length === 0) {
      if (typeof this.ngxPermissionsService.getPermission('OUTLET') !== 'undefined') {
        const index3: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoImagesCollection.indexOf(
          this.user.userOutletInfo.userOutletInfoImagesCollection.find(image => image.imageIndex === 3)) : - 1;
        this.imagesForm.controls['imageName3'].setValue(index3 < 0 ?
          '' : this.user.userOutletInfo.userOutletInfoImagesCollection[index3].fileName || '');
      } else if (typeof this.ngxPermissionsService.getPermission('COMPANY') !== 'undefined') {
        const index3: number = this.user.userCompanyInfo !== undefined ? this.user.userCompanyInfo.userCompanyInfoImagesCollection.indexOf(
          this.user.userCompanyInfo.userCompanyInfoImagesCollection.find(image => image.imageIndex === 3)) : - 1;
        this.imagesForm.controls['imageName3'].setValue(index3 < 0 ?
          '' : this.user.userCompanyInfo.userCompanyInfoImagesCollection[index3].fileName || '');
      }
    } else {
      this.imagesForm.controls['imageName3'].setValue(e.target.files[0].name);
      this.imageName3 = e.target.files[0].name;
    }
    this.imagesForm.markAsDirty();
  }

  image4FileChange (e) {
    this.disableButton = false;
    this.fileList4 = e.target.files;
    if (e.target.files.length === 0) {
      if (typeof this.ngxPermissionsService.getPermission('OUTLET') !== 'undefined') {
        const index4: number = this.user.userOutletInfo !== undefined ? this.user.userOutletInfo.userOutletInfoImagesCollection.indexOf(
          this.user.userOutletInfo.userOutletInfoImagesCollection.find(image => image.imageIndex === 4)) : - 1;
        this.imagesForm.controls['imageName4'].setValue(index4 < 0 ?
          '' : this.user.userOutletInfo.userOutletInfoImagesCollection[index4].fileName || '');
      } else if (typeof this.ngxPermissionsService.getPermission('COMPANY') !== 'undefined') {
        const index4: number = this.user.userCompanyInfo !== undefined ? this.user.userCompanyInfo.userCompanyInfoImagesCollection.indexOf(
          this.user.userCompanyInfo.userCompanyInfoImagesCollection.find(image => image.imageIndex === 4)) : - 1;
        this.imagesForm.controls['imageName4'].setValue(index4 < 0 ?
          '' : this.user.userCompanyInfo.userCompanyInfoImagesCollection[index4].fileName || '');
      }
    } else {
      this.imagesForm.controls['imageName4'].setValue(e.target.files[0].name);
      this.imageName4 = e.target.files[0].name;
    }
    this.imagesForm.markAsDirty();
  }

  removeImage (imageIndex) {
    this.imagesForm.controls['imageName' + imageIndex].setValue('');
    if (imageIndex === 1) {
      this.fileInput1.nativeElement.value = '';
    } else if (imageIndex === 2) {
      this.fileInput2.nativeElement.value = '';
    } else if (imageIndex === 3) {
      this.fileInput3.nativeElement.value = '';
    } else if (imageIndex === 4) {
      this.fileInput4.nativeElement.value = '';
    }
    this.imagesForm.markAsDirty();
  }

  cancelClick () {
    this.buildItemForm();
  }

  updateLocations () {
    this.disableButton = true;
    const data = this.locationsForm.value;
    if (typeof this.ngxPermissionsService.getPermission('OUTLET') !== 'undefined') {
      this.userSettingsService.editOutletLocations(data).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.disableButton = false;
          if (responseBuilder.code === + this.apiConfig.SUCCESS) {
            this.snack.open(this.translatePipe.transform('USERUPDATEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
          } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            this.svcGlobal.checkValidationResults(this.imagesForm, responseBuilder.data);
          }
        }
      );
    } else if (typeof this.ngxPermissionsService.getPermission('COMPANY') !== 'undefined') {
      this.userSettingsService.editCompanyLocations(data).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.disableButton = false;
          if (responseBuilder.code === + this.apiConfig.SUCCESS) {
            this.snack.open(this.translatePipe.transform('USERUPDATEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
          } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            this.svcGlobal.checkValidationResults(this.imagesForm, responseBuilder.data);
          }
        }
      );
    }
  }

  updateImages () {
    this.disableButton = true;
    const data = this.imagesForm.value;
    const formData: FormData = new FormData();
    if (this.fileList1.length > 0) {
      const file: File = this.fileList1[0];
      formData.append('uploadFile1', file, file.name);
    }
    if (this.fileList2.length > 0) {
      const file: File = this.fileList2[0];
      formData.append('uploadFile2', file, file.name);
    }
    if (this.fileList3.length > 0) {
      const file: File = this.fileList3[0];
      formData.append('uploadFile3', file, file.name);
    }
    if (this.fileList4.length > 0) {
      const file: File = this.fileList4[0];
      formData.append('uploadFile4', file, file.name);
    }
    formData.append('info', new Blob([JSON.stringify(data)], {type: 'application/json'}));
    if (typeof this.ngxPermissionsService.getPermission('OUTLET') !== 'undefined') {
      this.userSettingsService.editOutletImages(formData).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.disableButton = false;
          if (responseBuilder.code === + this.apiConfig.SUCCESS) {
            this.snack.open(this.translatePipe.transform('USERUPDATEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
          } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            this.svcGlobal.checkValidationResults(this.imagesForm, responseBuilder.data);
          }
        }
      );
    } else if (typeof this.ngxPermissionsService.getPermission('COMPANY') !== 'undefined') {
      this.userSettingsService.editCompanyImages(formData).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.disableButton = false;
          if (responseBuilder.code === + this.apiConfig.SUCCESS) {
            this.snack.open(this.translatePipe.transform('USERUPDATEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
          } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            this.svcGlobal.checkValidationResults(this.imagesForm, responseBuilder.data);
          }
        }
      );
    }
  }

  submit () {
    this.disableButton = true;
    this.userSettingsService.updateUser(this.itemForm.value).subscribe(
      (responseBuilder: ResponseBuilderModel) => {
        this.logsService.setLog('NgxSystemUsersPopupComponent', 'submit(updateUser)', responseBuilder);
        if (responseBuilder.code === + this.apiConfig.SUCCESS) {
          this.user = responseBuilder.data.user;
          this.svcGlobal.setSession('loggedInUser', this.user);
          const that = this;
          setTimeout(function () {
            that.snack.open(that.translatePipe.transform('USERUPDATEDSUCCESS'), that.translatePipe.transform('OK'), {duration: 4000});
          }, 300);
        } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
          this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
        }
        this.disableButton = false;
      }
    );
  }

  submitPassword () {
    this.disableButton = true;
    this.userSettingsService.updatePassword(this.passwordForm.value).subscribe(
      (responseBuilder: ResponseBuilderModel) => {
        this.logsService.setLog('NgxSystemUsersPopupComponent', 'submit(updateUser)', responseBuilder);
        if (responseBuilder.code === + this.apiConfig.SUCCESS) {
          this.snack.open(this.translatePipe.transform('USERUPDATEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
        } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
          this.svcGlobal.checkValidationResults(this.passwordForm, responseBuilder.data);
        }
        this.disableButton = false;
      }
    );
  }

  cancelClickPassword () {
    this.passwordForm.reset();
  }

  cancelClickLocations() {
    this.locationsForm.reset();
    this.buildItemForm();
  }

  cancelClickImages () {
    this.imagesForm.reset();
    this.buildItemForm();
  }

}
