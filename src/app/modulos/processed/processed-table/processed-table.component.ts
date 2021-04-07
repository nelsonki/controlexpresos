import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {animate, state, style, transition, trigger} from '@angular/animations';
import {SalidasServices} from '../../salidas/salidas-services/salidas-services'
import { environment } from '../../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-processed-table',
  templateUrl: './processed-table.component.html',
  styleUrls: ['./processed-table.component.scss'],  
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProcessedTableComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('basicModal') basicModal: ModalDirective;
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  displayedColumns: string[] = ['Item', 'ID', 'Cliente - Sucursal', 'Fecha Procesada', 'Usuario', 'Observación','Acciones'];
  dataSource;
  public titleModal: string;
  public element =[];
  public data;
  public dataOut;
  expandedElement;
  public api: string;

  ngAfterViewInit() {
  }
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public toasTer: ToastrService,
    public salidasServices: SalidasServices,
  ) {
    //this.api = environment.apiInventory;
   // this.titleModal = "Crear Salida";
   this.api = environment.apiJakiro2;

  }

  ngOnInit() {
    this.loadAll();
  }
  public loadAll(){ 

    this.salidasServices.getOperaciones().subscribe((value) => {
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
              "processed_time": value["data"][e].processed_time,
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

  public closeModals(value) {
    this.reloadComponent();
    this.basicModal.hide();
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
  print(id){
    window.open( this.api + 'outputs/print/' + id);

  }
} 