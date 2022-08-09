
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { VehiclesServices } from '../vehicles-services/vehicles-services'
import { VehiclesFormComponent } from '../vehicles-form/vehicles-form.component'
import { VehiclesDeleteComponent } from '../dialog/vehicles-delete/vehicles-delete.component'
import { Router } from "@angular/router";

declare var $: any;
@Component({
  selector: 'app-vehicles-table',
  templateUrl: './vehicles-table.component.html',
  styleUrls: ['./vehicles-table.component.scss']
})
export class VehiclesTableComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild(VehiclesFormComponent) form: VehiclesFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['Item', 'Placa', 'Número', 'Tipo', 'Descripción', 'Acciones'];
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
    public router: Router,
    public vehiclesServices: VehiclesServices

  ) {
    //this.api = environment.apiInventory;
    this.titleModal = "Crear Vehículo";
  }

  ngOnInit() {
    this.loadAll();
  }
  public loadAll() {

    this.vehiclesServices.getList().subscribe((value) => {
      this.data = [];
      this.element = [];
      if (value["list"]) {
        this.element = [];
        Object.keys(value["list"]).forEach(e => {
          const datos = {
            Item: "",
            "id": value["list"][e].id,
            "number": value["list"][e].number,
            "placa": value["list"][e].placa,
            "type": value["list"][e].type,
            "description": value["list"][e].description,

          };
          this.data.push(datos);
          this.element.push(datos);
          console.log(this.element)
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
        this.element = [];
        this.dataSource = new MatTableDataSource(this.element);
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
      }
    });

  }
  public openEdit(id) {
    this.titleModal = "Modificar Vehículo";
    this.form.addForm(id);
  }
  eliminar(id) {
    this.dialog.open(VehiclesDeleteComponent, {
      width: "450px",
      data: id
    });

  }
  reset() {

    this.form.firstform.controls["placa"].setValue("");
    this.form.firstform.controls["tipo"].setValue("");
    this.form.firstform.controls["numero"].setValue("");
    this.form.firstform.controls["description"].setValue("");

    this.titleModal = "Crear Vehículo";
    this.form.putSubmit = false;
    this.form.editSubmit = false;
  }
  Refresh() {
    this.loadAll();

  }
  public applyFilter(filterValue: string) {
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
    const refreshUrl = currentUrl.indexOf("/dashboard/vehicles") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
    //this.producEdit = [];
  }
}
