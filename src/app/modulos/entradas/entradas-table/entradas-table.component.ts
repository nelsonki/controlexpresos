import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";

declare var $: any;

@Component({
  selector: 'app-entradas-table',
  templateUrl: './entradas-table.component.html',
  styleUrls: ['./entradas-table.component.scss']
})
export class EntradasTableComponent implements OnInit {
  displayedColumns: string[] = ['Item', 'ID', 'Cliente - Sucursal', 'Fecha - Hora', 'Usuario', 'Observación', 'Acciones'];
  dataSource = new MatTableDataSource<PeriodicElement>(element);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("basicModal") basicModal: ModalDirective;
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  public titleModal: string;
  public element ;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; 
  }
  constructor(
    //public dialog: MatDialog,
    //public formBuilder: FormBuilder,
    public toasTer: ToastrService,
    //public templatesService: TemplatesService
  ) {
    //this.api = environment.apiInventory;
    this.titleModal = "Crear Entrada";
  }

  ngOnInit() {
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
export interface PeriodicElement { 
  id: string;
  cliente: string;
  fecha: string;
  usuario: string;
  observacion: string;
}
const element: PeriodicElement[] = [
  {id: 'a4', cliente: 'Nelson - Barata', fecha: '02-02-2021 12:00', usuario: 'admin' , observacion: 'sin comentarios'},
  {id: 'a3', cliente: 'Nelson - Locatel', fecha: '02-02-2021 12:00' , usuario: 'admin' , observacion: 'sin comentarios'},

];