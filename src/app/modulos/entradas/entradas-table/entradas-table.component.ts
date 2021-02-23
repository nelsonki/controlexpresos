import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from 'ngx-toastr';
import {EntradasServices} from '../entradas-services/entradas-services'
import {EntradasFormComponent} from '../entradas-form/entradas-form.component'
declare var $: any;

@Component({
  selector: 'app-entradas-table',
  templateUrl: './entradas-table.component.html',
  styleUrls: ['./entradas-table.component.scss']
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
  public data=[];
  ngAfterViewInit() {
  }
  constructor(
    //public dialog: MatDialog,
    //public formBuilder: FormBuilder,
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
  Refresh(){}
  applyFilter(event){}
  reset(){}
  showModal() {
    $("#basicModal").show();
    this.reset();
  }
  public closeModals(value) {
    this.basicModal.hide();
  }
}