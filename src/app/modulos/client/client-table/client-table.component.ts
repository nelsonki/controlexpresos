import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";

declare var $: any;

@Component({
  selector: 'app-client-table',
  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.scss']
})
export class ClientTableComponent implements OnInit {
  displayedColumns: string[] = ['DNI', 'Nombre Comercial', 'Dirección', 'Teléfono', 'Email', 'Acciones'];
  dataSource = new MatTableDataSource<PeriodicElement>(element);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('basicModal') basicModal!: ModalDirective;
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  public titleModal: string;
  public element: any[]; 

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
    this.titleModal = "Crear Cliente";
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
  dni: string;
  nombre: string;
  direccion: string;
  telefono:string;
  email:string;
}
const element: PeriodicElement[] = [
  {dni: 'a4', nombre: 'El junquito', direccion: 'cordero', telefono: '0412-1451212', email: 'rolavetadiuc@gmail.com' },
  {dni: 'a3', nombre: 'comercio', direccion: 'tariba', telefono: '0414-7897878', email: 'quinonezn@zippyttech.com' },

];