
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDeleteComponent } from '../dialog/user-delete/user-delete.component'
import { UserServices } from '../user-services/user-services'
import { UserFormComponent } from '../user-form/user-form.component'
import { Router } from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild(UserFormComponent) form: UserFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['Item', 'Nombre', 'Apellido', 'Correo', 'Rol', 'Acciones'];
  dataSource;
  public titleModal: string;
  public element;
  public data;

  ngAfterViewInit() {
  }
  constructor(
    public dialog: MatDialog,
    public toasTer: ToastrService,
    public userServices: UserServices,
    public router: Router

  ) {
    //this.api = environment.apiInventory;
    this.titleModal = "Crear Usuario";
  }

  ngOnInit() {
    this.loadAll()
  }
  public loadAll() {

    this.userServices.getList().subscribe((value) => {
      let r;
      this.data = [];
      this.element = [];
      console.log(value)
      if (value["data"]) {
        this.element = [];
        Object.keys(value["data"]).forEach(e => {
          if (value["data"][e].role_id === 1) {
            r = "Admin";
          } else {
            r = "Usuario";
          }

          const datos = {
            Item: "",
            "id": value["data"][e].id,
            "first_name": value["data"][e].first_name,
            "last_name": value["data"][e].last_name,
            "email": value["data"][e].email,
            "rol_id": value["data"][e].role_id,
            "rol": r,
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
    this.titleModal = "Modificar Usuario";
    this.form.addForm(id);
  }
  eliminar(id) {
    this.dialog.open(UserDeleteComponent, {
      width: "450px",
      data: id
    });

  }
  reset() {
    this.form.firstform.controls["nombre"].setValue("");
    this.form.firstform.controls["apellido"].setValue("");
    this.form.firstform.controls["correo"].setValue('');
    this.form.firstform.controls["rol"].setValue("");
    this.form.firstform.controls["partner"].setValue("");
    this.form.firstform.controls["partner_id"].setValue("");

    this.form.firstform.controls["clave"].setValue("");
    this.form.firstform.controls["rclave"].setValue("");

    this.titleModal = "Crear Usuario";
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