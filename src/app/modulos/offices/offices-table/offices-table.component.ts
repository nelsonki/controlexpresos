
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OfficesDeleteComponent } from '../dialog/offices-delete/offices-delete.component'
import { OfficesServices } from '../offices-services/offices-services'
import { OfficesFormComponent } from '../offices-form/offices-form.component'
import { Router } from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-offices-table',
  templateUrl: './offices-table.component.html',
  styleUrls: ['./offices-table.component.scss']
})
export class OfficesTableComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild(OfficesFormComponent) form: OfficesFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['Item', 'Nombre', 'Descripción', 'Tipo', 'Acciones'];
  dataSource;
  public titleModal: string;
  public element;
  public data;

  ngAfterViewInit() {
  }
  constructor(
    public dialog: MatDialog,
    public toasTer: ToastrService,
    public officesServices: OfficesServices,
    public router: Router

  ) {
    //this.api = environment.apiInventory;
    this.titleModal = "Crear Oficinas";
  }

  ngOnInit() {
    this.loadAll()
  }
  public loadAll() {

    this.officesServices.getList().subscribe((value) => {
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
            "description": value["data"][e].description,
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
    this.titleModal = "Modificar Oficinas";
    this.form.addForm(id);
  }
  eliminar(id) {
    this.dialog.open(OfficesDeleteComponent, {
      width: "450px",
      data: id
    });

  }
  reset() {
    this.form.firstform.controls["name"].setValue("");
    this.form.firstform.controls["description"].setValue("");
    this.form.firstform.controls["type"].setValue('');

    this.titleModal = "Crear Oficinas";
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