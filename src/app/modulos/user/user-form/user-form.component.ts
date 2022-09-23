import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { map, startWith } from 'rxjs/operators';

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
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PartnersServices } from './../../partners/partners-services/partners-services'
export interface Socios {
  id: number;
  name: string;
}
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
    { value: 2, name: 'Usuario' },
    { value: 1, name: 'Admin' },


  ]

  //buscar socio
  public filteredOptions7: Observable<Socios[]>;
  public options7: Array<any> = [];
  public idsubsocio7 = 0;


  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public userServices: UserServices,
    public http: HttpServices,
    private partnersServices: PartnersServices
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({
      nombre: ["", Validators.required],
      apellido: ["", Validators.required],
      clave: ["", Validators.required],
      rclave: ["", Validators.required],
      correo: ["", Validators.required],
      rol: ["", Validators.required],
      partner: ["", Validators.required],
      partner_id: [""],
    });
    /*BUSCAR socios*/
    this.partnersServices.getList().pipe()
      .subscribe((value) => {
        console.log(value)
        Object.keys(value["data"]).forEach(i => {
          this.options7.push(
            {
              "id": value["data"][i].id,
              "name": value["data"][i].first_name,

            }

          );

        });
      });
    this.filteredOptions7 = this.firstform.controls['partner'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter7(name) : this.options7.slice())
    );
  }
  public addForm(id) {
    this.idEdit = id;
    let dataEdit = [];
    this.editSubmit = true;
    this.putSubmit = true;
    Object.keys(this.element).forEach(i => {
      if (this.element[i].id == id) {
        console.log(this.element[i])
        dataEdit.push(this.element[i]);
      }
    });
    console.log(dataEdit[0]);
    this.firstform.controls["nombre"].setValue(dataEdit[0]["first_name"]);
    this.firstform.controls["apellido"].setValue(dataEdit[0]["last_name"]);
    this.firstform.controls["correo"].setValue(dataEdit[0]["email"]);
    this.firstform.controls["rol"].setValue(dataEdit[0]["rol_id"]);




  }
  public closeModal() {
    this.closeStatus = !this.closeStatus;
    this.statusCloseModal.emit(this.closeStatus);
  }
  onSubmit() {
    this.submitted = true;
    if (this.firstform.invalid) {
      return;
    } else {


      if (this.putSubmit) {
        this.loading = true;
        let bodyData = Object.assign({
          "first_name": this.firstform.controls["nombre"].value,
          "last_name": this.firstform.controls["apellido"].value,
          "email": this.firstform.controls["correo"].value,
          "role_id": this.firstform.controls["rol"].value,
          "partner_id": this.firstform.controls["partner_id"].value,
          "password": this.firstform.controls["clave"].value,
          "password_confirmation": this.firstform.controls["rclave"].value
        }); console.warn(bodyData);

        let repeatPass = this.firstform.controls["rclave"].value;
        if (bodyData.password === repeatPass) {
          this.userServices.update(this.idEdit, bodyData).subscribe(
            response => {
              this.toasTer.success(userMsg.update);
              this.reloadComponent();
            },
            error => {
              if (error["status"] === 422) {
                this.toasTer.error(error.error.data);
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

          this.toasTer.error('Las contraseñas no coinciden', 'Sistema Control');
          this.loading = false;

        }


      }
      else {
        this.loading = true;

        let bodyData = Object.assign({
          "first_name": this.firstform.controls["nombre"].value,
          "last_name": this.firstform.controls["apellido"].value,
          "email": this.firstform.controls["correo"].value,
          "role_id": this.firstform.controls["rol"].value,
          "partner_id": this.firstform.controls["partner_id"].value,
          "password": this.firstform.controls["clave"].value,
          "password_confirmation": this.firstform.controls["rclave"].value
        }); console.log(bodyData);

        let repeatPass = this.firstform.controls["rclave"].value;
        if (bodyData.password === repeatPass) {
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

          this.toasTer.error('Las contraseñas no coinciden', 'Sistema Control');
          this.loading = false;
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
  public closeOption() {
    this.openOptionClient = false;
  }

  /*BUSCAR socio*///////////////////////////////////////////////////////////////////////////////////////////////

  displayFn7(socio: Socios): string {
    return socio && socio.name ? socio.name : '';
  }

  onSelectionChanged7(event: MatAutocompleteSelectedEvent) {
    this.idsubsocio7 = 0;
    let namesub7: string;

    const viene7 = event.option.value;
    this.idsubsocio7 = viene7.id ? viene7.id : 0;
    namesub7 = viene7.name ? viene7.name : '';
    this.firstform.controls['partner'].setValue(namesub7);
    this.firstform.controls['partner_id'].setValue(this.idsubsocio7);

  }

  private _filter7(name: string): Socios[] {
    const filterValue7 = name.toLowerCase();
    return this.options7.filter(option => option.name.toLowerCase().indexOf(filterValue7) === 0);
  }
}
