import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ClientServices} from "../../client-services/client-services";
import {clientsMsg} from "../../../../utils/const/message";
import {ClientFormComponent}from '../../client-form/client-form.component'
@Component({
  selector: 'app-client-phone',
  templateUrl: './client-phone.component.html',
  styleUrls: ['./client-phone.component.scss']
})
export class ClientPhoneComponent implements OnInit {
  @ViewChild(ClientFormComponent) form: ClientFormComponent;

  public id:any;
  public verPhone=[];
  constructor(
      public dialogRef: MatDialogRef<ClientPhoneComponent>,
      public router: Router,
      public clientServices: ClientServices,
      public toasTer: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
      this.id = this.data;
  }
  ngOnInit() {
    var phones = (this.id)? this.id.split(","): "";
    this.verPhone = (phones !== "") ? phones : [];
    console.log(this.verPhone)
    }

 

}
