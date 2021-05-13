import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {ColorServices} from '../color-services/color-services'
import {ColorFormComponent} from '../color-form/color-form.component'
import {ColorDeleteComponent} from '../dialog/color-delete/color-delete.component'
import { Router } from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-color-table',
  templateUrl: './color-table.component.html',
  styleUrls: ['./color-table.component.scss']
})
export class ColorTableComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild(ColorFormComponent) form: ColorFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['Item', 'Color', 'Acciones'];
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
    public colorServices: ColorServices,
    public router: Router

  ) {
     //this.api = environment.apiInventory;
    this.titleModal = "Crear Color";
  }

  ngOnInit() {
    this.loadAll();
  }
  public loadAll(){ 

    this.colorServices.getList().subscribe((value) => {
      this.data=[];
      this.element=[];
      //console.log(value["data"])
      if (value["data"]){
        this.element = [];
        Object.keys(value["data"]).forEach(e => {
            const datos ={
              Item: "",
              "id":value["data"][e].id,
              "color":value["data"][e].color,
  
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
    this.titleModal = "Modificar Color";
    this.form.addForm(id);
  }
  eliminar(id){
    this.dialog.open(ColorDeleteComponent, {
     width: "450px",
     data: id
   });
  
  }
reset(){
  
  this.form.firstform.controls["color"].setValue("");

  this.titleModal = "Crear Color";
  this.form.putSubmit = false;
  this.form.editSubmit = false;
}
  Refresh(){
    this.loadAll();

  }
  public applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    Object.keys(this.dataSource.filteredData).forEach((i, index) => {
      this.dataSource.filteredData[i].Item = index + 1;
    });
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
    const refreshUrl = currentUrl.indexOf("/dashboard/Color") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
    //this.producEdit = [];
  }
}
 