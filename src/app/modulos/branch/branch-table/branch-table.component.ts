import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {BranchFormComponent} from '../branch-form/branch-form.component'
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

  displayedColumns: string[] = ['ID', 'Sucursal', 'Dirección',  'Acciones'];
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
    this.titleModal = "Crear Sucursal";
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
  sucursal: string;
  direccion: string;
  
}
const element: PeriodicElement[] = [
  {id: 'a4', sucursal: 'cordero', direccion: 'cordero' },
  {id: 'a3', sucursal: 'las lomas', direccion: 'san cristobal' },

];