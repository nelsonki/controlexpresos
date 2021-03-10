import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {animate, state, style, transition, trigger} from '@angular/animations';
import {SalidasServices} from '../salidas-services/salidas-services'
import {EntradasServices} from '../../entradas/entradas-services/entradas-services'
import {SalidasFormComponent} from '../salidas-form/salidas-form.component'
import {SalidasDeleteComponent} from '../dialog/salidas-delete/salidas-delete.component'
declare var $: any;

@Component({
  selector: 'app-salidas-table',
  templateUrl: './salidas-table.component.html',
  styleUrls: ['./salidas-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SalidasTableComponent implements OnInit {

  @ViewChild(SalidasFormComponent) form: SalidasFormComponent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('basicModal') basicModal: ModalDirective;
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  displayedColumns: string[] = ['Item', 'ID', 'Cliente - Sucursal', 'Fecha - Hora', 'Usuario', 'Observación', 'Acciones'];
  dataSource;
  public titleModal: string;
  public element =[];
  public data;
  public dataOut;
  expandedElement;

  ngAfterViewInit() {
  }
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public toasTer: ToastrService,
    public salidasServices: SalidasServices,
    public entradasServices: EntradasServices
  ) {
    //this.api = environment.apiInventory;
    this.titleModal = "Crear Salida";
  }

  ngOnInit() {
    this.loadAll();
  }
  public loadAll(){ 

    this.salidasServices.getList().subscribe((value) => {
      this.data=[];
      this.dataOut=[];

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
              "inputs":[],
              "outputs":[]
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
            Object.keys(value["data"][e].outputs).forEach(i => {
              this.dataOut =
              {
                id:value["data"][e].outputs[i].id,
                weight: value["data"][e].outputs[i].weight,
                quantity: value["data"][e].outputs[i].quantity,
                service_id: value["data"][e].outputs[i].service_id,
                service_name: value["data"][e].outputs[i].service_name,
                color_id: value["data"][e].outputs[i].color_id,
                color_name: value["data"][e].outputs[i].color_name,
                subservices_tag: value["data"][e].outputs[i].subservices_tag,
                operation_type: value["data"][e].outputs[i].operation_type,
                created_at: value["data"][e].outputs[i].date_time,
              } ;                       
              this.element[e].outputs.push(this.dataOut);
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
        this.dataOut = [];
        this.element=[];
        this.dataSource = new MatTableDataSource(this.element);
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
      }
    });
    
  }
  Refresh(){
    this.loadAll();
  }

  
  reset(){}
  showModal() {
    $("#basicModal").show();
    this.reset();
  }
  public closeModals(value) {
    this.reloadComponent();
    this.basicModal.hide();
  }
  public openEdit(id) {
    this.titleModal = "Crear Salidas";
    this.form.addForm(id);
  }
  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf("Boardings") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
    //this.producEdit = [];
  }
  public applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    Object.keys(this.dataSource.filteredData).forEach((i, index) => {
      this.dataSource.filteredData[i].Item = index + 1;
    });
  }
  eliminarOp(id){
    let modulo ="deleteOp";
    this.dialog.open(SalidasDeleteComponent, {
     width: "450px",
     data: [id, modulo,0]
   });
  
  }
} 