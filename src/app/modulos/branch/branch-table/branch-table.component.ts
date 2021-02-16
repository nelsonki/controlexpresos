import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {BranchFormComponent} from '../branch-form/branch-form.component'
import {BranchServices}from '../branch-services/branch-services'
import {BranchDeleteComponent} from '../dialog/branch-delete/branch-delete.component'
declare var $: any;

@Component({
  selector: 'app-branch-table',
  templateUrl: './branch-table.component.html',
  styleUrls: ['./branch-table.component.scss']
})
export class BranchTableComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild(BranchFormComponent) form: BranchFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['Item', 'Cliente', 'Sucursal', 'Dirección',  'Acciones'];
  dataSource ;
  public titleModal: string;
  public element; 
  public data; 

  ngAfterViewInit() {
   }
  constructor(
    public dialog: MatDialog,
    //public formBuilder: FormBuilder,
    public toasTer: ToastrService,
    public branchServices: BranchServices
  ) {
     //this.api = environment.apiInventory;
    this.titleModal = "Crear Sucursal";
  }

  ngOnInit() {
    this.loadAll();
  }
  public loadAll(){ 

    this.branchServices.getList().subscribe((value) => {
      this.data=[];
      this.element=[];
      console.log(value["data"])
      if (value["data"]){
        this.element = [];
        Object.keys(value["data"]).forEach(e => {
            const datos ={
              Item: "",
              "id":value["data"][e].id,
              "code":value["data"][e].code,
              "name":value["data"][e].name,
              "address":value["data"][e].address,
              "cliente":value["data"][e].cliente,
              "cliente_id":value["data"][e].cliente_id,

            };
           this.data.push(datos);
           this.element.push(datos);
           //console.log(this.element);
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
  Refresh(){}
  applyFilter(event){}
   showModal() {
    $("#basicModal").show();
    this.reset();
  }
  public closeModals(value) {
    this.basicModal.hide();
  }
  public openEdit(id) {
    this.titleModal = "Modificar Sucursal";
    this.form.addForm(id);
  }
  eliminar(id){
    this.dialog.open(BranchDeleteComponent, {
     width: "450px",
     data: id
   });
  
}
reset(){
  this.form.firstform.controls["client"].setValue("");
  this.form.firstform.controls["client_id"].setValue("");
  this.form.firstform.controls["name"].setValue("");
  this.form.firstform.controls["address"].setValue("");

  this.titleModal = "Crear Sucursal";
  this.form.putSubmit = false;
  this.form.editSubmit = false;
}
}
 