
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from "jquery";

//import { HttpService } from '../../../global-services/http.service';
//import { LocalService } from './../../../global-services/local-service.service';
//import { ClientService } from './../../../global-services/clients/client.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../../environments/environment';
//import { ICustomerType } from '../../../modules/settings/models/customer-type';
//import { IActivities } from '../../../modules/settings/models/activities';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LocalService } from '../../../http/httpServices/local-service.service';
import { HttpService } from '../../../http/httpServices/http.service';
import { userMsg } from "../../../utils/const/message";
import { SettingsServices } from '../../settings/settings-services/settings-services';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit {
  form: FormGroup;

  public account;
  public userRole;
  public apiSettings;

  public operations;
  public idOperations;


  inputObj: any;
  @Input() element: string;

  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  @Output() statusCloseModal = new EventEmitter();

  constructor(public router: Router,
    public toasTer: ToastrService,
    public http: HttpService,
    private formBuilder: FormBuilder,
    public localService: LocalService,
    public cd: ChangeDetectorRef,
    public settingsServices: SettingsServices,
    public dialog: MatDialog,

  ) {

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      operations: ['', ''],
    });
    let info = this.localService.getJsonValue('info');
    this.apiSettings = environment.apiUrl;
    this.getDataSettings();
    this.userRole = info.rol;

  }


  public compare(a, b, isAsc) {
    return (a > b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getDataSettings() {

    this.settingsServices.getList().subscribe((data: any) => {
      console.log(data['data'])
      this.operations = data['data'].total_operations;
      this.idOperations = data['data'].id;

      this.form.controls['operations'].setValue(data['data'].total_operations);
    });
  }




  submitUpdateProfile() {
    let bodyData;

    bodyData = {
      total_operations: this.form.controls['operations'].value,

    };






    if (this.idOperations) {
      this.settingsServices.update(this.idOperations, bodyData).subscribe(
        response => {
          this.toasTer.success(userMsg.update);
          this.reloadComponent();
        },
        error => {

          this.toasTer.error(userMsg.errorProcess);

        }
      );
    } else {
      this.settingsServices.save(bodyData).subscribe(
        response => {
          this.toasTer.success(userMsg.update);
          this.reloadComponent();
        },
        error => {

          this.toasTer.error(userMsg.errorProcess);

        }
      );
    }




  }

  goToMenu() {
    let info = this.localService.getJsonValue('info');
    if (info.rol.toLowerCase() === 'op_entradas') {
      this.router.navigate(['/dashboard/Entradas'])

    } else {
      this.router.navigate(['/dashboard/Stats'])

    }
  }

  reloadComponent() {
    let refreshUrl2;
    const currentUrl = this.router.url;
    let info = this.localService.getJsonValue('info');
    if (info.rol.toLowerCase() === 'op_entradas') {
      refreshUrl2 = currentUrl.indexOf("/dashboard/Entradas") > -1 ? "/" : "/";
    } else {
      refreshUrl2 = currentUrl.indexOf("/dashboard/Stats") > -1 ? "/" : "/";

    }
    this.router
      .navigateByUrl(refreshUrl2)
      .then(() => this.router.navigateByUrl(currentUrl));
  }
} 