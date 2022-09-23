
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdditionalsDeleteComponent } from '../dialog/additionals-delete/additionals-delete.component'
import { AdditionalsServices } from '../addtionals-services/additionals-services'
import { AddtionalFormComponent } from '../addtional-form/addtional-form.component'
import { Router } from "@angular/router";

declare var $: any;


@Component({
  selector: 'app-addtionals-table',
  templateUrl: './addtionals-table.component.html',
  styleUrls: ['./addtionals-table.component.scss']
})
export class AddtionalsTableComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild(AddtionalFormComponent) form: AddtionalFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['Item', 'Descripción', 'Porcentaje %', 'Cantidad', 'Moneda', 'Tipo', 'Acciones'];
  dataSource;
  public titleModal: string;
  public element;
  public data;

  ngAfterViewInit() {
  }
  constructor(
    public dialog: MatDialog,
    public toasTer: ToastrService,
    public additionalsServices: AdditionalsServices,
    public router: Router

  ) {
    //this.api = environment.apiInventory;
    this.titleModal = "Crear Gasto";
  }

  ngOnInit() {
    this.loadAll()
  }
  public loadAll() {

    this.additionalsServices.getList().subscribe((value) => {
      let r;
      this.data = [];
      this.element = [];
      console.log(value)
      if (value["data"]) {
        this.element = [];
        Object.keys(value["data"]).forEach(e => {


          const datos = {
            Item: "",
            "id": value["data"][e].id,
            "description": value["data"][e].description,
            "percent": value["data"][e].percent,
            "quantity": value["data"][e].quantity,
            "coin_id": value["data"][e].coin.symbol,
            "type": value["data"][e].type,

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
    this.titleModal = "Modificar Gasto";
    this.form.addForm(id);
  }
  eliminar(id) {
    this.dialog.open(AdditionalsDeleteComponent, {
      width: "450px",
      data: id
    });

  }
  reset() {
    this.form.firstform.controls["description"].setValue("");
    this.form.firstform.controls["type"].setValue("");
    this.form.firstform.controls["searchPC"].setValue("Seleccione");
    this.form.firstform.controls["moneda"].setValue("");
    this.form.firstform.controls["moneda_id"].setValue("");
    this.form.firstform.controls["monto"].setValue("");

    this.titleModal = "Crear Gasto";
    this.form.putSubmit = false;
    this.form.editSubmit = false;
    this.form.loading = false;
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
    const refreshUrl = currentUrl.indexOf("/dashboard/user") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
    //this.producEdit = [];
  }
}
