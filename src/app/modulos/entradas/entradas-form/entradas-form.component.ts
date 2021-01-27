import { ChangeDetectorRef, Component, OnInit, EventEmitter, ViewChild,   Input,   Output, } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
  MinLengthValidator
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { HttpServicesBoardings } from './../../http/httpServices/httpServicesBoardings';
//import { boardingsMsg } from '../../utils/const/message';
//import {BoardingsService} from '../../boardings/boardings-services/boardings.service';
import { Router } from "@angular/router";
import { Pipe, PipeTransform } from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-entradas-form',
  templateUrl: './entradas-form.component.html',
  styleUrls: ['./entradas-form.component.scss']
})
export class EntradasFormComponent implements OnInit {
  @Input() element: string  ;
  @Output() statusCloseModal = new EventEmitter();
  @ViewChild('stepper') stepper: MatStepper;

  public firstform: FormGroup ;
  public submitted = false;
  public loading: boolean = false;
  public editSubmit: boolean = false;
  public closeStatus: boolean = false;

  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public taskList = [];

   isLinear = false;
  public editField: string;
  public allProduct: string[] = [];
  isOptional = false;
  public ProductsList: string[] = [];
  public idEdit: any;
  public putSubmit: boolean = false;
  public isLoading;
  data: any = [];
  filteredOptions: Observable<string[]>;
  options: string[] = [];
  public ifbandera=0;

  firstFormGroup: FormGroup;
  myControl2: FormGroup;
  public nameButtonAceptar: string = 'Agregar';
  public idToUpdate: number;

  public personList: Array<any> = [
    {
      id: 0,
      servicio: '',
      peso: '',
      cantidad: '',
      color:  '',
      subservicio:  '',
      tipo: '',
    }
  ];
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    //public templatesService: TemplatesService
    public cd: ChangeDetectorRef,
    public dialog: MatDialog,
   // private http: HttpServicesBoardings,
    //private boardingsService: BoardingsService,
   ) {     
      this.isLoading = true;
   }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      cliente: ['', [Validators.required ]],
      sucursal: ['', [Validators.required, Validators.minLength(2) ]],
    });
    this.myControl2 = this.formBuilder.group({
      servicio:  ['', [Validators.required, Validators.minLength(2) ]],
      peso: ['', Validators.required],
      cantidad: ['' ],
      color:  ['' ],
      subservicio:  ['' ],
      tipo:  ['' ],
     });
  }
  public closeModal() {
    this.closeStatus = !this.closeStatus;
    this.statusCloseModal.emit(this.closeStatus);
  }
  onSubmit(){}
  get f() {
    return this.firstform.controls;
  }
  updateList(id: number, property: string, event: any) {
    let editField;
    editField = event.target.value;
    this.personList[id][property] = editField;
    this.cd.detectChanges();
}
public addForm(id) {  
}  

reloadComponent() {
  const currentUrl = this.router.url;
  const refreshUrl = currentUrl.indexOf("Boardings") > -1 ? "/" : "/";
  this.router
    .navigateByUrl(refreshUrl)
    .then(() => this.router.navigateByUrl(currentUrl));
  //this.producEdit = [];
}

onAuto(){}
changeValue(id: number, property: string, event: any) {
  this.editField = event.target.value;
}
public changeSelect(id: number, property: string, event: any,  value ) {
  this.editField =  value;
}
remove(id: any) {
  this.myControl2.reset();
   this.personList.splice(id, 1);
   this.nameButtonAceptar = 'Agregar';
}

add() {
  if (!this.myControl2.valid) {
    return;
  }else{
    if (this.nameButtonAceptar === 'Agregar') {
    this.handleSubmit(this.myControl2, null );
  } else {
    this.handleSubmit(this.myControl2, this.idToUpdate);
    this.personList.splice(this.idToUpdate, 1);

  }
  }
 }
 handleSubmit(form: FormGroup, idv?: number){
  let miid;
  if ( idv == null){
    miid = 0;
  }else{
    miid = this.personList[idv].id;
  }
  let fechab;
  if (form.value.date_from === '' || form.value.date_from === null){
    fechab= '';
   }else{
    fechab =this.convertFormat(form.value.date_from)
   } 
 
  this.personList.push({ 
    id: miid,
    name: form.value.name,
    passport_number: form.value.passport_number,
    date_from: fechab,
    sex:  form.value.sex,
  });
  console.log(this.personList);
  this.clearInput();
}
 edittri(id: any) {
  let fechaboat ;
  let fechab = (this.personList[id]["date_from"] === '' || this.personList[id]["date_from"] === null ) ? '' : this.personList[id]["date_from"];
if(fechab=== '' || fechab === null){
 fechaboat = '';
}else{
 fechaboat = fechab + "T00:00:00";
}
  

  this.myControl2.controls['name'].setValue(this.personList[id]["name"]);
  this.myControl2.controls['passport_number'].setValue(this.personList[id]["passport_number"]);
  this.myControl2.controls['date_from'].setValue(fechaboat);
  this.myControl2.controls['sex'].setValue(this.personList[id]["sex"]);
  this.nameButtonAceptar = 'Editar';
  this.idToUpdate = id;
  console.log(this.personList);
}


public clearInput() {
  this.myControl2.reset();
  this.nameButtonAceptar = 'Agregar';
 
 }

convertFormat(range){
var fechaSearch;

  var fecha = new Date(range);
  var dia = fecha.getDate();
  var mes = fecha.getMonth();
  var anno = fecha.getFullYear();

  

  if((mes + 1) < 10){
      fechaSearch = anno + '-' + 0 + (mes + 1);
    }else{
      fechaSearch = anno + '-' + (mes + 1);
  }

  if(dia < 10){
      fechaSearch = fechaSearch + '-' + 0 + (dia);
    }else{
      fechaSearch = fechaSearch + '-' + (dia);
  }

    
  return fechaSearch ;

}
public asigneStepper(stepper: MatStepper) {
  this.stepper = stepper;
} 
public returnStepper(stepper: MatStepper) {
  stepper.selectedIndex = 0;
}
public goForward(stepper: MatStepper) {
  stepper.reset();
}
}


