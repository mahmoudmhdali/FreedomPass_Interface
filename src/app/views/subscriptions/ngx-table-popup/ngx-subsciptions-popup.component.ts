import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ResponseBuilderModel} from '../../../shared/models/ResponseBuilder.model';
import {GlobalService} from '../../../shared/services/global.service';
import {AdminPassesService} from '../../../shared/services/database-services/adminPasses.service';

@Component({
  selector: 'app-ngx-subsciptions-popup',
  templateUrl: './ngx-subsciptions-popup.component.html'
})
export class NgxSubsciptionsPopupComponent implements OnInit {
  @ViewChild('fileInput1')
  fileInput1: ElementRef;
  public itemForm: FormGroup;
  disableButton = false;
  apiConfig;
  formIsSubmitted = false;
  offers = [];
  passes = [];
  fileList1 = [];
  imageName1 = '';
  offerOutlets = [];
  passOutlets = [];

  offersCollection: FormControl;
  passesCollection: FormControl;

  constructor (
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxSubsciptionsPopupComponent>,
    private fb: FormBuilder,
    private svcGlobal: GlobalService,
    private adminPassesService: AdminPassesService,
    private snack: MatSnackBar) {
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit () {
    this.buildItemForm(this.data.payload);
    this.offers = this.data.offers;
    this.passes = this.data.passes;
    for (const offer of this.offers) {
      const index: number = this.offerOutlets.indexOf(this.offerOutlets.find(outlet => outlet.id === offer.userOutletID));
      if (index < 0) {
        this.offerOutlets.push({id: offer.userOutletID, name: offer.userOutletName});
      }
    }
    for (const pass of this.passes) {
      const index: number = this.passOutlets.indexOf(this.passOutlets.find(outlet => outlet.id === pass.userOutletID));
      if (index < 0) {
        this.passOutlets.push({id: pass.userOutletID, name: pass.userOutletName});
      }
    }
  }

  buildItemForm (item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      name: [item.name || '', Validators.required],
      price: [item.price || '', Validators.required],
      validity: [item.validity || '', Validators.required],
      imageName1: [item.fileName || ''],
      description: [item.description || '', Validators.required]
    });

    if (this.data.isNew) {
      this.offersCollection = new FormControl([]);
      this.passesCollection = new FormControl([]);
    } else {
      const offersIds = [];
      const passesIds = [];
      for (const offersAndPasses of item.userOutletOfferCollection) {
        if (offersAndPasses.outletOfferType.id === 1) {
          offersIds.push(offersAndPasses.id);
        } else if (offersAndPasses.outletOfferType.id === 2) {
          passesIds.push(offersAndPasses.id);
        }
      }
      this.offersCollection = new FormControl(offersIds);
      this.passesCollection = new FormControl(passesIds);
    }
    this.itemForm.addControl('offersCollection', this.offersCollection);
    this.itemForm.addControl('passesCollection', this.passesCollection);
  }

  submit () {
    this.disableButton = true;
    const data = this.itemForm.value;
    data.corporateOnly = false;
    data.userOutletOfferCollection = [ ...data.offersCollection, ...data.passesCollection];
    const formData: FormData = new FormData();
    if (this.fileList1.length > 0) {
      const file: File = this.fileList1[0];
      formData.append('uploadFile1', file, file.name);
    }
    formData.append('info', new Blob([JSON.stringify(data)], {type: 'application/json'}));
    if (this.data.isNew) {
      this.adminPassesService.addPass(formData).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.disableButton = false;
          if (responseBuilder.code === + this.apiConfig.SUCCESS) {
            this.formIsSubmitted = true;
            this.dialogRef.close(responseBuilder.data.package);
            this.snack.open('Subsciptions Added Successfully', 'OK', {duration: 4000});
          } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
          } else {
            this.snack.open('Error', 'OK', {duration: 4000});
          }
        }
      );
    } else {
      this.adminPassesService.editPass(formData).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.disableButton = false;
          if (responseBuilder.code === + this.apiConfig.SUCCESS) {
            this.formIsSubmitted = true;
            this.dialogRef.close(responseBuilder.data.Package);
            this.snack.open('Subsciptions Updated Successfully', 'OK', {duration: 4000});
          } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
          } else {
            this.snack.open('Error', 'OK', {duration: 4000});
          }
        }
      );
    }
  }

  image1FileChange (e) {
    this.disableButton = false;
    this.fileList1 = e.target.files;
    if (e.target.files.length === 0) {
      this.itemForm.controls['imageName1'].setValue(this.data.payload.fileName || '');
    } else {
      this.itemForm.controls['imageName1'].setValue(e.target.files[0].name);
      this.imageName1 = e.target.files[0].name;
    }
  }

  removeImage (imageIndex) {
    this.itemForm.controls['imageName' + imageIndex].setValue('');
    if (imageIndex === 1) {
      this.fileInput1.nativeElement.value = '';
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
