
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
import { OfficesServices } from '../offices-services/offices-services';
import { environment } from '../../../../environments/environment'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpServices } from '../../../http/httpServices/httpServices'
import { Observable } from "rxjs";

@Component({
  selector: 'app-offices-form',
  templateUrl: './offices-form.component.html',
  styleUrls: ['./offices-form.component.scss']
})
export class OfficesFormComponent implements OnInit {
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


  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public officesServices: OfficesServices,
    public http: HttpServices
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", ""],
      type: ["", Validators.required],
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
    this.firstform.controls["name"].setValue(dataEdit[0]["name"]);
    this.firstform.controls["description"].setValue(dataEdit[0]["description"]);
    this.firstform.controls["type"].setValue(dataEdit[0]["type"]);



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
          "name": this.firstform.controls["name"].value,
          "description": this.firstform.controls["description"].value,
          "type": this.firstform.controls["type"].value,
        }); 
        console.warn(bodyData);

        this.officesServices.update(this.idEdit, bodyData).subscribe(
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


      }
      else {
        this.loading = true;

        let bodyData = Object.assign({
          "name": this.firstform.controls["name"].value,
          "description": this.firstform.controls["description"].value,
          "type": this.firstform.controls["type"].value,
        }); console.log(bodyData);

        this.officesServices.save(bodyData).subscribe(
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





      }

    }
  }
  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf("/dashboard/partners") > -1 ? "/" : "/";
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
}
