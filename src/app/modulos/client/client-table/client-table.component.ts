import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {ClientFormComponent} from '../client-form/client-form.component'
import {ClientServices}from '../client-services/client-services'
import {ClientDeleteComponent} from '../dialog/client-delete/client-delete.component'
import {ClientCorreoComponent} from '../dialog/client-correo/client-correo.component'
import {ClientPhoneComponent} from '../dialog/client-phone/client-phone.component'
import { Router } from "@angular/router";

 declare var $: any;

@Component({
  selector: 'app-client-table',
  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.scss']
})
export class ClientTableComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild(ClientFormComponent) form: ClientFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Item', 'DNI', 'Nombre Comercial',  'Teléfono','Email', 'Acciones'];
  dataSource;
  public titleModal: string;
  public element; 
  public data;
  
  ngAfterViewInit() {
   }
  constructor(
    public dialog: MatDialog,
    //public formBuilder: FormBuilder,
    public toasTer: ToastrService,
    public clientServices: ClientServices,
    public router: Router

  ) {
     //this.api = environment.apiInventory;
    this.titleModal = "Crear Cliente";
  }

  ngOnInit() {
    this.loadAll();
  }
  public loadAll(){ 

    this.clientServices.getList().subscribe((value) => {
      this.data=[];
      this.element=[];
      //console.log(value["data"])
      if (value["data"]){
        this.element = [];
        Object.keys(value["data"]).forEach(e => {
            const datos ={
              Item: "",
              "id":value["data"][e].id,
              "dni":value["data"][e].dni,
              "name":value["data"][e].name,
              "email":value["data"][e].email,
              "phone":value["data"][e].phone,
              "address":value["data"][e].address,
               "image":value["data"][e].image,
               "phoneV":[],
               "emailV":[]
            };
           this.data.push(datos);
           this.element.push(datos);
           console.log(this.element);
           var miphone =value["data"][e].phone;
           var phones = (miphone)? miphone.split(","): "";
           this.element[e].phoneV = (phones !== "") ? phones : [];
    
            var emails = (value["data"][e].email)? value["data"][e].email.split(","): "";
            this.element[e].emailV = (emails !== "") ? emails : []; 
        });
            

        Object.keys(this.element).forEach((i, index) => {
          this.element[i].Item = index + 1;
       });
        this.dataSource = new MatTableDataSource(this.element);
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
      } else {
        this.toasTer.error(value["message"]);
        this.data = [];
        this.element=[];
        this.dataSource = new MatTableDataSource(this.element);
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
      }
    });
    
  }
   public openEdit(id) {
    this.titleModal = "Modificar Cliente";
    this.form.addForm(id);
  }
  Refresh(){
    this.loadAll();
  }
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    Object.keys(this.dataSource.filteredData).forEach((i, index) => {
        this.dataSource.filteredData[i].Item = index + 1;
    });
}
  reset(){
    this.form.firstform.controls["dni"].setValue("");
    this.form.firstform.controls["name"].setValue("");
    this.form.firstform.controls["address"].setValue("");
    this.form.firstform.controls["fruitCtrl"].setValue("");
    this.form.firstform.controls["fruitCtrl2"].setValue("");
    this.form.firstform.controls["fruitCtrl"].setValue("");
    this.form.profileImage2=null;
    this.form.fruits=[];
    this.form.fruits2=[];
    this.form.fruitCtrl.setValue(null);
    this.form.fruitCtrl2.setValue(null);
    this.form.firstform.controls["fruitCtrl2"].setValue(this.form.fruits2);

    this.form.firstform.controls["fruitCtrl"].setValue(this.form.fruits);
    this.form.firstform.reset();
    this.titleModal = "Crear Cliente";
    this.form.putSubmit = false;
    this.form.editSubmit = false;
  }
  showModal() {
    $("#basicModal").show();
    this.reset();
  }
  public closeModals(value) {
    this.reloadComponent();
    this.basicModal.hide();
  }
  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf("/dashboard/Client") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
    //this.producEdit = [];
  }
  eliminar(id){
    this.dialog.open(ClientDeleteComponent, {
     width: "450px",
     data: id
   });
  
}
verCorreo(id){
  this.dialog.open(ClientCorreoComponent, {
   width: "550px",
   data: id
 });

}
verPhone(id){
  this.dialog.open(ClientPhoneComponent, {
   width: "550px",
   data: id
 });

}
}
 