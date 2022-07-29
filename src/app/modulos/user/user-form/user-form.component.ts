import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { userMsg } from "../../../utils/const/message";
import { ToastrService } from "ngx-toastr";
import { UserServices } from '../user-services/user-services';
import { environment } from '../../../../environments/environment'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpServices } from '../../../http/httpServices/httpServices'
import { Observable } from "rxjs";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() element: string;
  @Output() statusCloseModal = new EventEmitter();

  public firstform: FormGroup;
  public submitted = false;
  public loading: boolean = false;
  public editSubmit: boolean = false;
  public closeStatus: boolean = false;

  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public taskList = [];

  public putSubmit: boolean = false;
  public idEdit: any;

  public api;
  openOptionClient: boolean = false;
  filteredOptions: Observable<string[]>;
  public disabledButoon: boolean = false;
  public validCliente: boolean = false;

  public roles: any[] = [
    { value: 'operador', name: 'Operador' },
    { value: 'admin', name: 'Admin' },
    { value: 'op_entradas', name: 'Op. entradas' },
    { value: 'cliente', name: 'Cliente' }

  ]




  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public userServices: UserServices,
    public http: HttpServices
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({
      nombre: ["", Validators.required],
      username: ["", Validators.required],
      rol: ["", Validators.required],
      clave: ["", Validators.required],
      rclave: ["", Validators.required],
      client: ["", ""],
      client_id: [0, ""],
    });
  }
  public addForm(id) {
    this.idEdit = id;
    let dataEdit = [];
    this.editSubmit = true;
    this.putSubmit = true;
    Object.keys(this.element).forEach(i => {
      if (this.element[i].id == id) {
        dataEdit.push(this.element[i]);
      }
    });
    console.log(dataEdit[0]);
    this.firstform.controls["nombre"].setValue(dataEdit[0]["name"]);
    this.firstform.controls["username"].setValue(dataEdit[0]["username"]);
    this.firstform.controls["rol"].setValue(dataEdit[0]["rol"]);
    if (dataEdit[0]["rol"] === "cliente") {
      this.validCliente = true;
      this.firstform.controls["client_id"].setValue(dataEdit[0].id_cliente_asoc);
      console.log(dataEdit[0])
      this.firstform.controls["client"].setValue(dataEdit[0].cliente_name);
    } else {
      this.validCliente = false;
      this.firstform.controls["client_id"].setValue(0);
      this.firstform.controls["client"].setValue("");

    }

  }
  public closeModal() {
    this.closeStatus = !this.closeStatus;
    this.statusCloseModal.emit(this.closeStatus);
  }
  onSubmit() {
    let cliente_asoc = null
    this.submitted = true;
    if (this.firstform.invalid) {
      return;
    } else {
      if (this.validCliente && (this.firstform.controls["client_id"].value === 0 || this.firstform.controls["client_id"].value == "")) {
        this.toasTer.error('Debe agregar un cliente');
        this.loading = false;
        return;

      } else {


        if (this.putSubmit) {
          cliente_asoc = this.firstform.controls["client_id"].value
          this.loading = true;
          let bodyData = Object.assign({
            "fullname": this.firstform.controls["nombre"].value,
            "username": this.firstform.controls["username"].value,
            "rol": this.firstform.controls["rol"].value,
            "password": this.firstform.controls["clave"].value,
            "id_cliente_asoc": cliente_asoc

          });
          let repeatPass = this.firstform.controls["rclave"].value;
          if (bodyData.password === repeatPass) {
            // console.warn(bodyData);
            this.userServices.update(this.idEdit, bodyData).subscribe(
              response => {
                this.toasTer.success(userMsg.update);
                this.reloadComponent();
              },
              error => {
                if (error["status"] === 422) {
                  this.toasTer.error('Ya existe ');
                  this.loading = false;

                } else {
                  this.loading = false;
                  this.toasTer.error(userMsg.errorProcess);
                  this.loading = false;
                }
              }
            );
          } else {
            this.loading = false;

            this.toasTer.error('Las contraseñas no coinciden', 'Sistema Jakiro');
            this.loading = false;

          }


        }
        else {
          this.loading = true;
          cliente_asoc = this.firstform.controls["client_id"].value

          let bodyData = Object.assign({
            "fullname": this.firstform.controls["nombre"].value,
            "username": this.firstform.controls["username"].value,
            "rol": this.firstform.controls["rol"].value,
            "password": this.firstform.controls["clave"].value,
            "id_cliente_asoc": cliente_asoc
          });
          let repeatPass = this.firstform.controls["rclave"].value;
          if (bodyData.password === repeatPass) {
            // console.log(bodyData);
            this.userServices.save(bodyData).subscribe(
              response => {
                this.toasTer.success(userMsg.save);
                this.reloadComponent();
              },
              error => {
                if (error["status"] === 422) {
                  this.toasTer.error('Ya existe ');
                  this.loading = false;

                } else {
                  this.loading = false;
                  this.toasTer.error(userMsg.errorProcess);
                  this.loading = false;
                }
              }
            );
          } else {
            this.loading = false;

            this.toasTer.error('Las contraseñas no coinciden', 'Sistema Jakiro');
            this.loading = false;
          }




        }
      }
    }
  }
  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf("/dashboard/user") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
  }
  get f() {
    return this.firstform.controls;
  }
  //BUSCAR CLIENTE PARA EL ROL cliente
  public searchClient() {
    this.api = environment.apiJakiro2;
    let valueSearch = this.firstform.controls["client"].value;
    if (valueSearch.trim() !== "") {
      let enpoint = "clients/search/" + this.firstform.controls["client"].value;
      this.http.doGet(this.api, enpoint).subscribe((data: any) => {
        console.log(data);
        if (data.length > 0) {
          this.openOptionClient = true;
          this.filteredOptions = data;
        } else {
          this.openOptionClient = false;
          this.firstform.controls["client_id"].setValue(0);
          this.firstform.controls["client"].setValue("");
        }
      });
    }
  }
  public setDataFormulRol(event, nombre) {
    if (nombre === "cliente") {
      this.validCliente = true
    } else {
      this.validCliente = false
      this.firstform.controls["client_id"].setValue(0);
      this.firstform.controls["client"].setValue("");
    }
    console.log(nombre)
    //this.openOptionClient = false;
    //this.firstform.controls["client_id"].setValue(id);
    //this.firstform.controls["client"].setValue(nombreComercial);
  }
  public setDataFormul(event, id, nombreComercial) {
    this.openOptionClient = false;
    this.firstform.controls["client_id"].setValue(id);
    this.firstform.controls["client"].setValue(nombreComercial);
  }
  public closeOption() {
    this.openOptionClient = false;
  }
}
