import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ResponseBuilderModel} from '../../../shared/models/ResponseBuilder.model';
import {UserOutletOffersService} from '../../../shared/services/database-services/userOutletOffers.service';
import {GlobalService} from '../../../shared/services/global.service';

@Component({
  selector: 'app-ngx-offers-popup',
  templateUrl: './ngx-offers-popup.component.html'
})
export class NgxOffersPopupComponent implements OnInit {
  public itemForm: FormGroup;
  disableButton = false;
  apiConfig;
  formIsSubmitted = false;
  types = [];
  usageTypes = [
    {value: '1', viewValue: 'Weekly'},
    {value: '2', viewValue: 'Monthly'},
    {value: '3', viewValue: 'Yearly'}
  ];
  outlets = [];
  fileList1 = [];
  fileList2 = [];
  fileList3 = [];
  fileList4 = [];
  imageName1 = '';
  imageName2 = '';
  imageName3 = '';
  imageName4 = '';

  constructor (
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxOffersPopupComponent>,
    private fb: FormBuilder,
    private svcGlobal: GlobalService,
    private snack: MatSnackBar,
    private userOutletOfferService: UserOutletOffersService) {
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit () {
    this.buildItemForm(this.data.payload);
    for (const type of this.data.offerTypes) {
      this.types.push({value: type.id.toString(), viewValue: type.name});
    }
    for (const outlet of this.data.outlets) {
      this.outlets.push({value: outlet.userOutletInfo.id.toString(), viewValue: outlet.name});
    }
    console.log(this.data.isNew);
  }

  buildItemForm (item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      name: [item.name || '', Validators.required],
      numberOfUsage: [item.numberOfUsage || '', Validators.required],
      typeOfUsage: [item.typeOfUsage ? item.typeOfUsage.toString() : '1' || '1', Validators.required],
      outletOfferType: [item.outletOfferType ? item.outletOfferType.id.toString() : '1' || '1', Validators.required],
      userOutletInfo: [item.userOutletID ? item.userOutletID.toString() : '' || '', Validators.required],
      // validity: [item.validity || '', Validators.required],
      info: [item.info || '', Validators.required]
    });
    const index1: number = item.userOutletOfferImagesCollection !== undefined ? item.userOutletOfferImagesCollection.indexOf(
      item.userOutletOfferImagesCollection.find(image => image.imageIndex === 1)) : - 1;
    this.itemForm.addControl('imageName1', new FormControl(index1 < 0 ?
      '' : item.userOutletOfferImagesCollection[index1].fileName || ''));
    const index2: number = item.userOutletOfferImagesCollection !== undefined ? item.userOutletOfferImagesCollection.indexOf(
      item.userOutletOfferImagesCollection.find(image => image.imageIndex === 2)) : - 1;
    this.itemForm.addControl('imageName2', new FormControl(index2 < 0 ?
      '' : item.userOutletOfferImagesCollection[index2].fileName || ''));
    const index3: number = item.userOutletOfferImagesCollection !== undefined ? item.userOutletOfferImagesCollection.indexOf(
      item.userOutletOfferImagesCollection.find(image => image.imageIndex === 3)) : - 1;
    this.itemForm.addControl('imageName3', new FormControl(index3 < 0 ?
      '' : item.userOutletOfferImagesCollection[index3].fileName || ''));
    const index4: number = item.userOutletOfferImagesCollection !== undefined ? item.userOutletOfferImagesCollection.indexOf(
      item.userOutletOfferImagesCollection.find(image => image.imageIndex === 4)) : - 1;
    this.itemForm.addControl('imageName4', new FormControl(index4 < 0 ?
      '' : item.userOutletOfferImagesCollection[index4].fileName || ''));
  }

  submit () {
    this.disableButton = true;
    const data = this.itemForm.value;
    const offerType = data.outletOfferType;
    data.outletOfferType = {};
    data.outletOfferType.id = offerType;
    const userOutlet = data.userOutletInfo;
    data.userOutletInfo = {};
    data.userOutletInfo.id = userOutlet;
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
    console.log(data);
    formData.append('info', new Blob([JSON.stringify(data)], {type: 'application/json'}));
    formData.append('outlet', new Blob([JSON.stringify(data.userOutletInfo)], {type: 'application/json'}));
    if (this.data.isNew) {
      this.userOutletOfferService.addOffer(formData).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.disableButton = false;
          if (responseBuilder.code === + this.apiConfig.SUCCESS) {
            this.formIsSubmitted = true;
            this.dialogRef.close(responseBuilder.data.offer);
            this.snack.open('Offer Added Successfully', 'OK', {duration: 4000});
          } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            data.outletOfferType = offerType;
            data.userOutletInfo = userOutlet;
            this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
          } else {
            data.outletOfferType = offerType;
            data.userOutletInfo = userOutlet;
            this.snack.open('Error', 'OK', {duration: 4000});
          }
        }
      );
    } else {
      this.userOutletOfferService.editOffer(formData).subscribe(
        (responseBuilder: ResponseBuilderModel) => {
          this.disableButton = false;
          if (responseBuilder.code === + this.apiConfig.SUCCESS) {
            this.formIsSubmitted = true;
            this.dialogRef.close(responseBuilder.data.offer);
            this.snack.open('Offer Updated Successfully', 'OK', {duration: 4000});
          } else if (responseBuilder.code === + this.apiConfig.PARAMETERS_VALIDATION_ERROR) {
            data.outletOfferType = offerType;
            data.userOutletInfo = userOutlet;
            this.svcGlobal.checkValidationResults(this.itemForm, responseBuilder.data);
          } else {
            data.outletOfferType = offerType;
            data.userOutletInfo = userOutlet;
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
      const index1: number = this.data.payload.userOutletOfferImagesCollection !== undefined ?
        this.data.payload.userOutletOfferImagesCollection.indexOf(
          this.data.payload.userOutletOfferImagesCollection.find(image => image.imageIndex === 1)) : - 1;
      this.itemForm.controls['imageName1'].setValue(index1 < 0 ?
        '' : this.data.payload.userOutletOfferImagesCollection[index1].fileName || '');
    } else {
      this.itemForm.controls['imageName1'].setValue(e.target.files[0].name);
      this.imageName1 = e.target.files[0].name;
    }
  }

  image2FileChange (e) {
    this.disableButton = false;
    this.fileList2 = e.target.files;
    if (e.target.files.length === 0) {
      const index2: number = this.data.payload.userOutletOfferImagesCollection !== undefined ?
        this.data.payload.userOutletOfferImagesCollection.indexOf(
          this.data.payload.userOutletOfferImagesCollection.find(image => image.imageIndex === 2)) : - 1;
      this.itemForm.controls['imageName2'].setValue(index2 < 0 ?
        '' : this.data.payload.userOutletOfferImagesCollection[index2].fileName || '');
    } else {
      this.itemForm.controls['imageName2'].setValue(e.target.files[0].name);
      this.imageName2 = e.target.files[0].name;
    }
  }

  image3FileChange (e) {
    this.disableButton = false;
    this.fileList3 = e.target.files;
    if (e.target.files.length === 0) {
      const index3: number = this.data.payload.userOutletOfferImagesCollection !== undefined ?
        this.data.payload.userOutletOfferImagesCollection.indexOf(
          this.data.payload.userOutletOfferImagesCollection.find(image => image.imageIndex === 3)) : - 1;
      this.itemForm.controls['imageName3'].setValue(index3 < 0 ?
        '' : this.data.payload.userOutletOfferImagesCollection[index3].fileName || '');
    } else {
      this.itemForm.controls['imageName3'].setValue(e.target.files[0].name);
      this.imageName3 = e.target.files[0].name;
    }
  }

  image4FileChange (e) {
    this.disableButton = false;
    this.fileList4 = e.target.files;
    if (e.target.files.length === 0) {
      const index4: number = this.data.payload.userOutletOfferImagesCollection !== undefined ?
        this.data.payload.userOutletOfferImagesCollection.indexOf(
          this.data.payload.userOutletOfferImagesCollection.find(image => image.imageIndex === 4)) : - 1;
      this.itemForm.controls['imageName4'].setValue(index4 < 0 ?
        '' : this.data.payload.userOutletOfferImagesCollection[index4].fileName || '');
    } else {
      this.itemForm.controls['imageName4'].setValue(e.target.files[0].name);
      this.imageName4 = e.target.files[0].name;
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
