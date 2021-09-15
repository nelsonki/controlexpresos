import {Component, Inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { Observable, of, Subscription } from 'rxjs';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SalidasServices} from "../../salidas-services/salidas-services";
import {SalidasMsg} from "../../../../utils/const/message";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ClientServices } from '../../../client/client-services/client-services'
import {BranchServices} from '../../../branch/branch-services/branch-services'
@Component({
  selector: 'app-salidas-filtro',
  templateUrl: './salidas-filtro.component.html',
  styleUrls: ['./salidas-filtro.component.scss']
})
export class SalidasFiltroComponent implements OnInit {
  public id:any;
  public modulo:any;
  public bandera:any;
  public miArray:string[] =[]
  campaignOne: FormGroup;
  formGroup: FormGroup;

  eventoStart
  keysStart
  eventoEnd
  keysEnd
  keySearch: string;

  //variables para buscar cliente
  openOptionCliente: boolean = false;
  loadingCliente: boolean = false
  filteredOptionsCliente: Observable<string[]>;
  searchButtonCliente: boolean = false;

  //variables para buscar sucursal
  openOptionSucursal: boolean = false;
  loadingSucursal: boolean = false
  filteredOptionsSucursal: Observable<string[]>;
  searchButtonSucursal: boolean = false;

  clienteValid: boolean = false;
  sucursalValid: boolean = false;
  idClienteParaSucursal
  idSucursal
  constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<SalidasFiltroComponent>,
      public router: Router,
      public salidasServices: SalidasServices,
      public clientServices: ClientServices,
      public branchServices: BranchServices,
      public toasTer: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: MatDialog,
      private changeDetector : ChangeDetectorRef,

  ) {
     /* this.id = this.data[0];
      this.modulo = this.data[1];
      this.bandera = this.data[2];*/

  }
  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }
  
  ngOnInit() {
    const today2 = new Date();
    const day = today2.getDay();

    const month2 = today2.getMonth();
    const year2 = today2.getFullYear();
    this.campaignOne = new FormGroup({
      start2: new FormControl(),
      end2: new FormControl()
    });
    this.formGroup = this.fb.group({
      myControlCliente: ["",""],
      myControlSucursal: ["",""],
      });


  }
  filterByDateStart(event: MatDatepickerInputEvent<Date>, key) {
    console.log("startChange", event.value, key)
    this.eventoStart = event.value
    this.keysStart = key
  }
  filterByDateEnd(event: MatDatepickerInputEvent<Date>, key) {
    console.log("endChange", event.value, key)
    this.eventoEnd = event.value
    this.keysEnd = key
  }

  public filtrarOperaciones() {
    const cliente = this.idClienteParaSucursal
    const sucursal = this.idSucursal
    this.miArray.push((this.eventoStart)?this.eventoStart:0)
    this.miArray.push((this.keysStart)?this.keysStart:0)
    this.miArray.push((this.eventoEnd)?this.eventoEnd:0)
    this.miArray.push((this.keysEnd)?this.keysEnd:0)
    this.miArray.push((cliente)?cliente:0)
    this.miArray.push((sucursal)?sucursal:0)

    this.dialogRef.close(this.miArray)

    //this.reloadComponent();
  }
  searchKeyCode(event, key) {
    if (event.keyCode === 13) {
      switch (key) {
        case 'cliente':
          this.keySearch = 'cliente';
          this.searchCliente();
          break;
        case 'sucursal':
          this.keySearch = 'sucursal';
          this.searchSucursal();
          break;      
        default:
          break;
      }
    }

  }
  asignKey(value){
    this.keySearch = value;
   }

   disableValidInput(key) {
    switch (key) {
      case "clienteValid":
        this.clienteValid = false;
        break;             
      case "sucursalValid":
        this.sucursalValid = false;
        break;
      default:
        break;
    }
  }

  //cliente
setDataFormulClienteNull() {
  this.openOptionCliente = false;
  this.formGroup.controls["myControlCliente"].setValue("");
}
public setDataFormulCliente(event, id, name) {
  this.openOptionCliente = false;
  this.idClienteParaSucursal = id
  this.formGroup.controls["myControlCliente"].setValue(name);  
  this.clienteValid = true

}
public searchCliente() {
  this.clienteValid = false
  this.loadingCliente = true;
  this.searchButtonCliente = true
  let valueSearchCliente = this.formGroup.controls["myControlCliente"].value;
  if (valueSearchCliente && this.keySearch === "cliente") {
    //valueSearchCliente = valueSearchCliente;
    //    this.cargarService.getTodasOperacion(valueSearchOperacion).subscribe((data: any) => {

   
      this.clientServices.getListClienteFiltro(valueSearchCliente).subscribe((data: any) => {
      console.log(data);
      if (data.length > 0) {
        if (data.length === 1) {
          this.formGroup.controls["myControlCliente"].setValue(data[0].name);
          this.idClienteParaSucursal = data[0].id

          this.searchButtonCliente = false;
          this.openOptionCliente = false;
          this.searchButtonCliente = false
          this.loadingCliente = false;
          this.clienteValid = true
          this.changeDetector.detectChanges();
          return false;
        }
        this.openOptionCliente = true;
        this.filteredOptionsCliente = data;
        this.searchButtonCliente = false
        this.loadingCliente = false;
        this.changeDetector.detectChanges();
      } else {
        this.openOptionCliente = false;
        this.formGroup.controls["myControlCliente"].setValue("");

        this.toasTer.error("No existe cliente " + valueSearchCliente)
        this.searchButtonCliente = false
        this.loadingCliente = false;
        this.changeDetector.detectChanges();
      }
    }, error => {
      this.searchButtonCliente = false;
      this.openOptionCliente = false;
      this.searchButtonCliente = false
      this.loadingCliente = false;
    });
  } else {
    this.searchButtonCliente = false;
    this.loadingCliente = false;
  }
}

//cliente

//sucursal
setDataFormulSucursalNull() {
  this.openOptionSucursal = false;
  this.formGroup.controls["myControlSucursal"].setValue("");
}
public setDataFormulSucursal(event, id, name) {
  this.openOptionSucursal = false;
  this.idSucursal = id

  this.formGroup.controls["myControlSucursal"].setValue(name);  
  this.sucursalValid = true

}
public searchSucursal() {

  this.sucursalValid = false
  this.loadingSucursal = true;
  this.searchButtonSucursal = true
  let valueSearchSucursal = this.formGroup.controls["myControlSucursal"].value;
  if (valueSearchSucursal && this.keySearch === "sucursal") {
    valueSearchSucursal = valueSearchSucursal;
    //    this.cargarService.getTodasOperacion(valueSearchOperacion).subscribe((data: any) => {

   
      this.branchServices.getListIdClienteSinEntrada(this.idClienteParaSucursal).subscribe((data: any) => {
      console.log(data);
      if (data.length > 0) {
        if (data.length === 1) {
          this.formGroup.controls["myControlSucursal"].setValue(data[0].name);
          this.idSucursal = data[0].id

          this.searchButtonSucursal = false;
          this.openOptionSucursal = false;
          this.searchButtonSucursal = false
          this.loadingSucursal = false;
          this.sucursalValid = true
          this.changeDetector.detectChanges();
          return false;
        }

        this.openOptionSucursal = true;
        this.filteredOptionsSucursal = data;
        this.searchButtonSucursal = false
        this.loadingSucursal = false;
        this.changeDetector.detectChanges();
      } else {
        this.openOptionSucursal = false;
        this.formGroup.controls["myControlSucursal"].setValue("");

        this.toasTer.error("No existe sucursal " + valueSearchSucursal)
        this.searchButtonSucursal = false
        this.loadingSucursal = false;
        this.changeDetector.detectChanges();
      }
    }, error => {
      this.searchButtonSucursal = false;
      this.openOptionSucursal = false;
      this.searchButtonSucursal = false
      this.loadingSucursal = false;
    });
  } else {
    this.searchButtonSucursal = false;
    this.loadingSucursal = false;
  }
}

//sucursal
/*
  reloadComponent(){
      const currentUrl = this.router.url;
      const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }*/


}
