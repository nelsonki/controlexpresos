
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import {SubServiceDeleteComponent} from '../dialog/sub-service-delete/sub-service-delete.component'
//import {SubServiceServices} from '../sub-service-services/sub-service-services'
//import {SubServiceFormComponent} from '../sub-service-form/sub-service-form.component'
declare var $: any;

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;
  //@ViewChild(SubServiceFormComponent) form: SubServiceFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['Item',  'Nombre', 'Correo'];
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
    //public subServiceServices: SubServiceServices
  ) {
     //this.api = environment.apiInventory;
    this.titleModal = "Crear Usuario";
  }

  ngOnInit() {
    this.loadAll()
  }
  public loadAll(){ 
/*
    this.subServiceServices.getList().subscribe((value) => {
      this.data=[];
      this.element=[];
     // console.log(value["data"])
      if (value["data"]){
        this.element = [];
        Object.keys(value["data"]).forEach(e => {
            const datos ={
              Item: "",
              "id":value["data"][e].id,
              "name":value["data"][e].name,

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
    */
  }
  public openEdit(id) {
    this.titleModal = "Modificar Usuario";
    //this.form.addForm(id);
  }
  eliminar(id){/*
    this.dialog.open(SubServiceDeleteComponent, {
     width: "450px",
     data: id
   });*/
  
}
reset(){/*
  
  this.form.firstform.controls["name"].setValue("");

  this.titleModal = "Crear Sub Servicio";
  //this.form.putSubmit = false;
  this.form.editSubmit = false;*/
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
    this.basicModal.hide();
  }
}