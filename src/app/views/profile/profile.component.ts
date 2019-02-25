import {Component, OnInit, ViewChild} from '@angular/core';
import {UserProfileModel} from '../../shared/models/UserProfile.model';
import {UserSettingsService} from '../../shared/services/database-services/userSettings.service';
import {GlobalService} from '../../shared/services/global.service';
import {LogsService} from '../../shared/services/logs.service';
import {FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {FormCanDeactivate} from '../../shared/components/can-deactivate/form-can-deactivate/form-can-deactivate';
import {LanguageModel} from '../../shared/models/Language.model';
import {LanguageService} from '../../shared/services/database-services/language.service';
import {ResponseBuilderModel} from '../../shared/models/ResponseBuilder.model';
import {MatSnackBar} from '@angular/material';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LayoutService} from '../../shared/services/layout.service';
import {CustomValidators} from 'ng2-validation';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {NotificationEventService} from '../../shared/services/database-services/NotificationEvent.service';
import {NotificationEventModel} from '../../shared/models/NotificationEvent.model';
import {AppLoaderService} from '../../shared/services/app-loader/app-loader.service';

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
  selectedLanguageValue: number;
  languages: LanguageModel[];
  hidePassword = true;
  hideConfirmPassword = true;
  hideNewPassword = true;
  userNotificationEvents: NotificationEventModel[];


  selectedSCLocations = [];
  public notificationForm: FormGroup;

  constructor(private userSettingsService: UserSettingsService,
              private svcGlobal: GlobalService,
              private languageService: LanguageService,
              private snack: MatSnackBar,
              private translatePipe: TranslatePipe,
              private loader: AppLoaderService,
              public translate: TranslateService,
              private logsService: LogsService,
              private notificationEventServiceService: NotificationEventService,
              private layout: LayoutService,
              private fb: FormBuilder) {
    super();
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit() {
    forkJoin([this.userSettingsService.getUser(), this.languageService.getLanguages(), this.notificationEventServiceService.getByUser()])
      .subscribe(responses => {
        this.logsService.setLog('AddAlarmComponent', 'ngOnInit(getAlarmLevels)', responses[0]);
        if (responses[0].code === +this.apiConfig.SUCCESS) {
          this.user = responses[0].data.user;
          this.modelLoaded++;
        }
        this.logsService.setLog('AddAlarmComponent', 'ngOnInit(getAlarmServices)', responses[1]);
        if (responses[1].code === +this.apiConfig.SUCCESS) {
          this.languages = responses[1].data.languages;
          this.modelLoaded++;
        }
        this.logsService.setLog('AddAlarmComponent', 'ngOnInit(getAlarmServices)', responses[1]);
        if (responses[2].code === +this.apiConfig.SUCCESS) {
          this.userNotificationEvents = responses[2].data.notifications;
          this.modelLoaded++;
        }
        if ((responses[0].code && responses[1].code && responses[2].code) === +this.apiConfig.SUCCESS) {
          this.buildItemForm();
        }
      });
  }

  buildItemForm() {
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
      jobTitle: [{value: this.user.jobTitle, disabled: true}, Validators.required],
      mobileNumber: [this.user.mobileNumber || '', Validators.required]
    });
    this.itemForm.addControl('language', new FormControl([], [Validators.required]));
    if (this.user.language !== null) {
      this.selectedLanguageValue = this.user.language.id;
    }

    this.notificationForm = this.fb.group({});
    this.notificationForm.addControl('userNotification', new FormArray([]));

    for (let i = 0; i < this.userNotificationEvents.length; i++) {
      this.selectedSCLocations.push({'reportField': 'code', 'displayName': 'displayName'});
      this.addExtensionListControlOnInit(this.userNotificationEvents[i].userProfileNotificationEventCollection[0].enabled,
        this.userNotificationEvents[i].id, i);
    }
  }

  addExtensionListControlOnInit(enabled, id, index) {
    const jobGroup: FormGroup = new FormGroup({});
    const control1: FormControl = new FormControl(enabled, Validators.required);
    const control3: FormControl = new FormControl(id);
    jobGroup.addControl('enabled', control1);
    jobGroup.addControl('id', control3);
    (<FormArray> this.notificationForm.get('userNotification')).push(jobGroup);
    (<FormGroup>(<FormArray>this.notificationForm.controls['userNotification'])
      .controls[index]).controls['enabled'].setValue(enabled);
    (<FormGroup>(<FormArray>this.notificationForm.controls['userNotification'])
      .controls[index]).controls['id'].setValue(id);
  }

  cancelClick() {
    this.buildItemForm();
    this.itemForm.controls['language'].reset(this.selectedLanguageValue, Validators.required);
  }

  submit() {
    this.disableButton = true;
    this.userSettingsService.updateUser(this.itemForm.value).subscribe(
      (responseBuilder: ResponseBuilderModel) => {
        this.logsService.setLog('NgxUsersPopupComponent', 'submit(updateUser)', responseBuilder);
        if (responseBuilder.code === +this.apiConfig.SUCCESS) {
          this.user = responseBuilder.data.user;
          const currentLang = this.user.language.prefix;
          this.translate.use(currentLang);
          this.svcGlobal.setSession('loggedInUser', this.user);

          this.languageService.setCurrentLang(currentLang);
          if (currentLang === 'ar' || currentLang === 'fa') {
            this.layout.publishLayoutChange({dir: 'rtl'});
          } else {
            this.layout.publishLayoutChange({dir: 'ltr'});
          }
          const that = this;
          setTimeout(function () {
            that.snack.open(that.translatePipe.transform('USERUPDATEDSUCCESS'), that.translatePipe.transform('OK'), {duration: 4000});
          }, 300);
        } else if (responseBuilder.code === +this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
          this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
        }
        this.disableButton = false;
      }
    );
  }

  submitPassword() {
    this.disableButton = true;
    this.userSettingsService.updatePassword(this.passwordForm.value).subscribe(
      (responseBuilder: ResponseBuilderModel) => {
        this.logsService.setLog('NgxUsersPopupComponent', 'submit(updateUser)', responseBuilder);
        if (responseBuilder.code === +this.apiConfig.SUCCESS) {
          this.snack.open(this.translatePipe.transform('USERUPDATEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
        } else if (responseBuilder.code === +this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
          this.svcGlobal.checkValidationResults(this.passwordForm, responseBuilder.data);
        }
        this.disableButton = false;
      }
    );
  }

  cancelClickPassword() {
    this.passwordForm.reset();
  }

  submitNotifications() {
    this.disableButton = true;
    this.loader.open(this.translatePipe.transform('PLEASEWAIT'));
    this.notificationEventServiceService.updateUserNotifications(this.notificationForm.value.userNotification).subscribe(
      (responseBuilder: ResponseBuilderModel) => {
        this.logsService.setLog('NgxUsersPopupComponent', 'submit(updateUser)', responseBuilder);
        if (responseBuilder.code === +this.apiConfig.SUCCESS) {
          this.snack.open(this.translatePipe.transform('USERUPDATEDSUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
        } else if (responseBuilder.code === +this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
          this.svcGlobal.checkValidationResults(this.passwordForm, responseBuilder.data);
        }
        this.disableButton = false;
        this.loader.close();
      }
    );
  }

}
