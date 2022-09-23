
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoinsDeleteComponent } from '../dialog/coins-delete/coins-delete.component'
import { CoinsServices } from '../coins-services/coins-services'
import { CoinsFormComponent } from '../coins-form/coins-form.component'
import { Router } from "@angular/router";

declare var $: any;


@Component({
  selector: 'app-coins-table',
  templateUrl: './coins-table.component.html',
  styleUrls: ['./coins-table.component.scss']
})
export class CoinsTableComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild(CoinsFormComponent) form: CoinsFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['Item', 'Nombre', 'Simbolo', 'Acciones'];
  dataSource;
  public titleModal: string;
  public element;
  public data;

  ngAfterViewInit() {
  }
  constructor(
    public dialog: MatDialog,
    public toasTer: ToastrService,
    public coinsServices: CoinsServices,
    public router: Router

  ) {
    //this.api = environment.apiInventory;
    this.titleModal = "Crear Moneda";
  }

  ngOnInit() {
    this.loadAll()
  }
  public loadAll() {

    this.coinsServices.getList().subscribe((value) => {
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
            "name": value["data"][e].name,
            "symbol": value["data"][e].symbol,
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
    this.titleModal = "Modificar Moneda";
    this.form.addForm(id);
  }
  eliminar(id) {
    this.dialog.open(CoinsDeleteComponent, {
      width: "450px",
      data: id
    });

  }
  reset() {
    this.form.firstform.controls["nombre"].setValue("");
    this.form.firstform.controls["symbol"].setValue("");

    this.titleModal = "Crear Moneda";
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