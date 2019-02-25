import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/services/database-services/user.service';
import {UserProfileModel} from '../../shared/models/UserProfile.model';
import 'rxjs/Rx';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {NgxUsersPopupComponent} from './ngx-users-popup/ngx-users-popup.component';
import {GlobalService} from '../../shared/services/global.service';
import {ResponseBuilderModel} from '../../shared/models/ResponseBuilder.model';
import {AppConfirmService} from '../../shared/services/app-confirm/app-confirm.service';
import {AppLoaderService} from '../../shared/services/app-loader/app-loader.service';
import {animate, group, state, style, transition, trigger} from '@angular/animations';
import {LogsService} from '../../shared/services/logs.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [TranslatePipe],
  animations: [
    trigger('user1', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      // void is when the div is not exist in the DOM
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(800)
      ]),
      transition('* => void', [
        group([
          animate(300, style({
            color: 'red'
          })),
          animate(800, style({
            opacity: 0,
            transform: 'translateX(+100px)'
          }))
        ])
      ])
    ])
  ]
})
export class AppUsersComponent implements OnInit {
  users: UserProfileModel[];
  user: UserProfileModel;
  apiConfig;
  modelLoaded = 0;
  currentPage = 1;

  constructor(private dialog: MatDialog,
              private userService: UserService,
              private snack: MatSnackBar,
              private translatePipe: TranslatePipe,
              private logsService: LogsService,
              public confirmService: AppConfirmService,
              private loader: AppLoaderService,
              private svcGlobal: GlobalService) {
    this.apiConfig = this.svcGlobal.getSession('RESPONSE_CODE');
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(
      (responseBuilder) => {
        this.logsService.setLog('AppUsersComponent', 'ngOnInit(getUsers)', responseBuilder);
        if (responseBuilder.code === +this.apiConfig.SUCCESS) {
          this.users = responseBuilder.data.users;
          this.modelLoaded++;
        }
      }
    );
  }

  openPopUp(data: UserProfileModel, isNew, viewOnly) {
    let title = isNew === true ? this.translatePipe.transform('ADDNEWMEMBER') : this.translatePipe.transform('UPDATEMEMBER');
    if (viewOnly) {
      title = this.translatePipe.transform('VIEWMEMBER');
    }
    const dialogRef: MatDialogRef<any> = this.dialog.open(NgxUsersPopupComponent, {
      width: '720px',
      disableClose: true,
      data: {
        title: title,
        payload: data,
        isNew: isNew,
        viewOnly: viewOnly
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      // If user press cancel
      if (!res) {
        return;
      }
      if (!isNew) {
        const index: number = this.users.indexOf(this.users.find(user => user.id === res.id));
        this.users.splice(index, 1);
      }
      this.users.unshift(res);
    });


  }

  removeUser(data: UserProfileModel) {
    this.confirmService.confirm({
      title: this.translatePipe.transform('CONFIRMDIALOG'),
      message: this.translatePipe.transform('DELETECONFIRMATION') + ` \"${data.name}\"?`
    }).subscribe((result) => {
      if (result === true) {
        this.loader.open(this.translatePipe.transform('PLEASEWAIT'));
        this.userService.removeUser(data).subscribe(
          (responseBuilder: ResponseBuilderModel) => {
            this.logsService.setLog('AppUsersComponent', 'removeUser', responseBuilder);
            if (responseBuilder.code === +this.apiConfig.SUCCESS) {
              const index: number = this.users.indexOf(this.users.find(user => user.id === data.id));
              this.users.splice(index, 1);
              this.snack.open(this.translatePipe.transform('USERDELETESUCCESS'), this.translatePipe.transform('OK'), {duration: 4000});
            } else if (responseBuilder.code === +this.apiConfig.ENTITY_NOT_FOUND) {
              this.snack.open(responseBuilder.description, this.translatePipe.transform('OK'), {duration: 4000});
            }
            this.loader.close();
          }
        );
      }
    });
  }

  setPage(event) {
    this.modelLoaded--;
    this.userService.getUsers().subscribe(
      (responseBuilder) => {
        this.logsService.setLog('AppUsersComponent', 'ngOnInit(getUsers)', responseBuilder);
        if (responseBuilder.code === +this.apiConfig.SUCCESS) {
          this.currentPage = event;
          this.users = [];
          this.users.push(responseBuilder.data.users[this.currentPage - 1]);
          // this.users = responseBuilder.data.users;
          this.modelLoaded++;
        }
      }
    );
  }

}
