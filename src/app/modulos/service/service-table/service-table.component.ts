import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {ServiceFormComponent} from '../service-form/service-form.component'
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

  displayedColumns: string[] = ['ID', 'Nombre', 'Margen', 'Acciones'];
  dataSource = new MatTableDataSource<PeriodicElement>(element);
  public titleModal: string;
  public element; 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    public dialog: MatDialog,
    //public formBuilder: FormBuilder,
    public toasTer: ToastrService,
    //public templatesService: TemplatesService
  ) {
     //this.api = environment.apiInventory;
    this.titleModal = "Crear Servicio";
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
  nombre: string;
  margen: string;
}
const element: PeriodicElement[] = [
  {id: 'a4', nombre: 'Limpieza', margen: '0'  },
  {id: 'a3', nombre: 'Secado', margen: '1'  },

];