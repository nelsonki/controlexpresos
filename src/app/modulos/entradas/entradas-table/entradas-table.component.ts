import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from 'ngx-toastr';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Router} from "@angular/router";

import {EntradasServices} from '../entradas-services/entradas-services'
import {EntradasFormComponent} from '../entradas-form/entradas-form.component'
import {EntradasDeleteComponent} from '../dialog/entradas-delete/entradas-delete.component'
declare var $: any;

@Component({
  selector: 'app-entradas-table',
  templateUrl: './entradas-table.component.html',
  styleUrls: ['./entradas-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EntradasTableComponent implements OnInit {

  @ViewChild(EntradasFormComponent) form: EntradasFormComponent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('basicModal') basicModal: ModalDirective;
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  displayedColumns: string[] = ['Item', 'ID', 'Cliente - Sucursal', 'Fecha - Hora', 'Usuario', 'Observación', 'Acciones'];
  dataSource;
  public titleModal: string;
  public element =[];
  data: any = [];
  expandedElement;

  ngAfterViewInit() {
   }
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public toasTer: ToastrService,
    public entradasServices: EntradasServices
  ) {
    //this.api = environment.apiInventory;
    this.titleModal = "Crear Entrada";
  }

  ngOnInit() {
    this.loadAll()
  }
  public loadAll(){ 

    this.entradasServices.getList().subscribe((value) => {
      this.data=[];
      this.element=[];
      console.log(value["data"])
      if (value["data"]){
        this.element = [];
        Object.keys(value["data"]).forEach(e => {
            const datos ={
              Item: "",
              "id":value["data"][e].id,
              "client_name":value["data"][e].client_name,
              "client_id":value["data"][e].client_id,
              "branch_name":value["data"][e].branch_name,
              "branch_id":value["data"][e].branch_id,
              "observation":value["data"][e].observation,
              "date_time": value["data"][e].date_time,
              "inputs":[]
            };
            this.element.push(datos);
            Object.keys(value["data"][e].inputs).forEach(i => {
            this.data =
            {
              id:value["data"][e].inputs[i].id,
              weight: value["data"][e].inputs[i].weight,
              quantity: value["data"][e].inputs[i].quantity,
              service_id: value["data"][e].inputs[i].service_id,
              service_name: value["data"][e].inputs[i].service_name,

              color_id: value["data"][e].inputs[i].color_id,
              color_name: value["data"][e].inputs[i].color_name,
              subservices_tag: value["data"][e].inputs[i].subservices_tag,
              operation_type: value["data"][e].inputs[i].operation_type,
              created_at: value["data"][e].inputs[i].date_time,
            } ;                       
            this.element[e].inputs.push(this.data);
              });
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
  Refresh(){
    this.loadAll()

  }
  public applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    Object.keys(this.dataSource.filteredData).forEach((i, index) => {
      this.dataSource.filteredData[i].Item = index + 1;
    });
  }
  reset(){
   /* this.form.myControl2.reset();*/
    this.form.nameButtonAceptar = 'Agregar';
    this.form.firstFormGroup.controls['client'].setValue('');
    this.form.firstFormGroup.controls['client_id'].setValue('');
    this.form.secondsFormGroup.controls['sucursal'].setValue('');
    this.form.secondsFormGroup.controls['sucursal_id'].setValue('');
    this.form.treeFormGroup.controls['observacion'].setValue('');

    this.form.myControl2.controls['myControl_ser'].setValue('');
    this.form.myControl2.controls['myControl_ser_id'].setValue('');

    this.form.myControl2.controls['peso'].setValue('');
    this.form.myControl2.controls['cantidad'].setValue('');
    this.form.myControl2.controls['myControl_color'].setValue('');
    this.form.myControl2.controls['myControl_color_id'].setValue('');

    this.form.myControl2.controls['myControl_sub'].setValue('');
    this.form.myControl2.controls['tipo'].setValue('');

    this.form.fruits2=[];
    this.form.myControl2.controls["fruitCtrl2"].setValue('');

    this.form.putSubmit = false;
    this.titleModal = "Crear Entrada";
    this.form.personList = [];
    this.form.stepper.selectedIndex = 0;
    this.form.idsubservicio6=0;
    this.form.vieneSucursal =false;
  }
  showModal() {
    $("#basicModal").show();
    this.reset();
  }
  public closeModals(value) {
    this.reloadComponent();
    this.basicModal.hide();

  }
  reloadComponent(){
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
    this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
}
  public openEdit(id) {
    this.titleModal = "Modificar Entrada";
    this.form.addForm(id);
  }
  eliminar(id){
    let modulo ="delete";
    this.dialog.open(EntradasDeleteComponent, {
     width: "450px",
     data: [id, modulo,0]
   });
  
  }
  eliminarOp(id){
    let modulo ="deleteOp";
    this.dialog.open(EntradasDeleteComponent, {
     width: "450px",
     data: [id, modulo,0]
   });
  
  }
 }