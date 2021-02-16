import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {ServiceServices} from '../service-services/service-services'
import {ServiceFormComponent} from '../service-form/service-form.component'

import {ServiceDeleteComponent} from '../dialog/service-delete/service-delete.component'
declare var $: any;

@Component({
  selector: 'app-service-table',
  templateUrl: './service-table.component.html',
  styleUrls: ['./service-table.component.scss']
})
export class ServiceTableComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild(ServiceFormComponent) form: ServiceFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['Item', 'Nombre', 'Margen', 'Acciones'];
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
    public serviceServices: ServiceServices
  ) {
     //this.api = environment.apiInventory;
    this.titleModal = "Crear Servicio";
  }

  ngOnInit() {
    this.loadAll()
  }
  public loadAll(){ 

    this.serviceServices.getList().subscribe((value) => {
      this.data=[];
      this.element=[];
      console.log(value["data"])
      if (value["data"]){
        this.element = [];
        Object.keys(value["data"]).forEach(e => {
            const datos ={
              Item: "",
              "id":value["data"][e].id,
              "name":value["data"][e].name,
              "error_range":value["data"][e].error_range,

            };
           this.data.push(datos);
           this.element.push(datos);
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
    this.titleModal = "Modificar Servicio";
    this.form.addForm(id);
  }
  eliminar(id){
    this.dialog.open(ServiceDeleteComponent, {
     width: "450px",
     data: id
   });
  
}
  Refresh(){}
  applyFilter(event){}
  reset(){
  
    this.form.firstform.controls["nombre"].setValue("");
    this.form.firstform.controls["margen"].setValue("");

    this.titleModal = "Crear Color";
    //this.form.putSubmit = false;
    this.form.editSubmit = false;
  } 
   showModal() {
    $("#basicModal").show();
    this.reset();
  }
  public closeModals(value) {
    this.basicModal.hide();
  }
} 