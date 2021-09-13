import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {animate, state, style, transition, trigger} from '@angular/animations';
import {SalidasServices} from '../salidas-services/salidas-services'
import {EntradasServices} from '../../entradas/entradas-services/entradas-services'
import {SalidasFormComponent} from '../salidas-form/salidas-form.component'
import {SalidasDeleteComponent} from '../dialog/salidas-delete/salidas-delete.component'
import {SalidasCerrarComponent} from '../dialog/salidas-cerrar/salidas-cerrar.component'
import { environment } from '../../../../environments/environment';
import { DateRangeComponent } from '../date-range/date-range.component';

declare var $: any;

@Component({
  selector: 'app-salidas-table',
  templateUrl: './salidas-table.component.html',
  styleUrls: ['./salidas-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SalidasTableComponent implements OnInit {

  @ViewChild(SalidasFormComponent) form: SalidasFormComponent;
  @ViewChild(DateRangeComponent) dateRange: DateRangeComponent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('basicModal') basicModal: ModalDirective;
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  displayedColumns: string[] = ['Item', 'ID', 'Cliente - Sucursal', 'Fecha - Hora','Peso de salida', 'Usuario',  'Acciones'];
  dataSource;
  public titleModal: string;
  public element =[];
  public data;
  public dataOut;
  expandedElement;
  public api: string;

  fechas:any;
  public contInit:number = 0;
  public fechaInicio="";
  public fechaFin="";
  public fechaExcelInicio="";
  public fechaExcelFin = "";

  public total_weight_in=0;
  public total_weight_out=0;
  //public grupoID =[];
  //public resultGrupoID =[]
  ngAfterViewInit() {
  }
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public toasTer: ToastrService,
    public salidasServices: SalidasServices,
    public entradasServices: EntradasServices
    

  ) {
    //this.api = environment.apiInventory;
    this.titleModal = "Crear Salida";
    this.api = environment.apiJakiro2;
  }

  ngOnInit() {
    this.fechaInicio="";
    this.fechaFin="";
    this.fechaExcelInicio="";
    this.fechaExcelFin = "";
    this.total_weight_in=0; 
    //this.loadAll(this.fechaInicio, this.fechaFin);
  }
  public loadAll(fInicio?, fFin?){ 
    this.total_weight_in=0;
    this.total_weight_out=0;
    this.salidasServices.getList(fInicio, fFin).subscribe((value) => {
      this.data=[];
      this.dataOut=[];

      this.element=[];
      //console.log(value["data"])
      if (value["data"]){
        this.element = [];
        Object.keys(value["data"]).forEach(e => {
            const datos ={
              Item: "",
              "id":value["data"][e].id,
              "client_name":value["data"][e].client_name,
              "client_id":value["data"][e].client_id,
              "branch_name":value["data"][e].branch_name,
              "branch_id":value["data"][e].branch_id,
              "observation":value["data"][e].observation,
              "obs_out":value["data"][e].obs_out,
              "date_time": value["data"][e].date_time,
              "user":value["data"][e].user,
              "weight_in": value["data"][e].weight_in,
              "weight_out": value["data"][e].weight_out,
              "inputs":[],
              "outputs":[],
              "grupos":[],
            };
            this.element.push(datos);
            Object.keys(value["data"][e].inputs).forEach(i => {
            this.data =
            {
              id:value["data"][e].inputs[i].id,
              weight: value["data"][e].inputs[i].weight,
              quantity: value["data"][e].inputs[i].quantity,
              service_id: value["data"][e].inputs[i].service_id,
              service_name: value["data"][e].inputs[i].service_name,
              color_id: value["data"][e].inputs[i].color_id,
              color_name: value["data"][e].inputs[i].color_name,
              subservices_tag: value["data"][e].inputs[i].subservices_tag,
              operation_type: value["data"][e].inputs[i].operation_type,
              created_at: value["data"][e].inputs[i].date_time,
            } ;                       
            this.element[e].inputs.push(this.data);
            });
            //this.grupoID=[]
            //this.resultGrupoID=[]
            Object.keys(value["data"][e].outputs).forEach(i => {
              this.dataOut =
              {
                id:value["data"][e].outputs[i].id,
                group_id: value["data"][e].outputs[i].group_id,
                weight: value["data"][e].outputs[i].weight,
                quantity: value["data"][e].outputs[i].quantity,
                service_id: value["data"][e].outputs[i].service_id,
                service_name: value["data"][e].outputs[i].service_name,
                color_id: value["data"][e].outputs[i].color_id,
                color_name: value["data"][e].outputs[i].color_name,
                subservices_tag: value["data"][e].outputs[i].subservices_tag,
                operation_type: value["data"][e].outputs[i].operation_type,
                created_at: value["data"][e].outputs[i].date_time,
              } ;                                      
              this.element[e].outputs.push(this.dataOut);

              //this.grupoID.push(value["data"][e].outputs[i].group_id)
            });  
            //const dataArr = new Set(this.grupoID);
            //this.resultGrupoID = [...dataArr];
            //console.log(this.resultGrupoID)              
            Object.keys(this.element).forEach((i, index) => {
                this.element[i].Item = index + 1;
            });
            let i = 0; 
            let grupo 
            let bodyData
            let lista=[]
            if(this.element[e].outputs.length !==0){
             // buscar los ids
            let ids = [];
            for (let values of this.element[e].outputs) {
              ids.push(values.group_id)
            }
            //elimino repetidos
            const dataArr = new Set(ids);
            let resultId = [...dataArr];
            let valueGroupId
           let pesoParcial=0
           let cantidadParcial=0

             //agrupo salidas por id
            for (let data of resultId) { 
              
              valueGroupId = this.element[e].outputs.filter(function (e) {  
                if(e.group_id == data) {
                  pesoParcial =   pesoParcial+ parseFloat(e.weight)
                  cantidadParcial =   cantidadParcial+ parseFloat(e.quantity)

                }

                return e.group_id == data;  

              }); 
               //console.log(valueGroupId);
              let dataEnd = Object.assign({}, {
                subPeso:pesoParcial,
                subCantidad:cantidadParcial,
                group_id: data,
                values: valueGroupId
              });
              pesoParcial=0
              cantidadParcial=0
              this.element[e].grupos.push(dataEnd)
              //this.element[e].grupos[data]=dataEnd;
              //lista.push(dataEnd);
            }
            //console.log(lista);
            //console.log(this.element[e])              
            }           
         });
         
         Object.keys(this.element).forEach((i, index) => {
          //this.total_weight_in = this.total_weight_in + parseFloat(this.element[i].weight_in) ;
          this.total_weight_out = this.total_weight_out + parseFloat(this.element[i].weight_out) ;

       });
       
       //console.log(this.element)
        this.dataSource = new MatTableDataSource(this.element);
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
      } else {
        this.toasTer.error(value["message"]);
        this.data = [];
        this.dataOut = [];
        this.element=[];
        this.dataSource = new MatTableDataSource(this.element);
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
      }
    });
    
  }
  Refresh(){
    
    this.fechaInicio="";
    this.fechaFin="";
    this.fechaExcelInicio="";
    this.fechaExcelFin = "";
    this.loadAll(this.fechaInicio, this.fechaFin);
  }

   //*  FUNCION PARA EL FILTRADO DESDE EL SELECTOR DE FECHAS

   public DateFilter(event) {
    //const info = JSON.parse(localStorage.getItem('info'));
    this.contInit = 0;
    this.fechas = event;
    const fechaInicio = this.convertFormat(this.fechas.fromDate);
    const fechaFinal  = this.convertFormat(this.fechas.toDate);
    this.fechaExcelInicio=this.convertFormatYear(this.fechas.fromDate);
    this.fechaExcelFin=this.convertFormatYear(this.fechas.toDate);
    //this.doWhere = 'where=[ {"op":"eq","field":"hg.account","value":' + info.account +'}, {"op":"bt", "field":"hg.created_at", "value":["' + fechaInicio + ' 01:00:00","' + fechaFinal + ' 23:59:59"]}]'
    //this.doWhereReport = 'where=[ {"op":"eq","field":"hg.account","value":' + info.account +'}, {"op":"bt", "field":"hg.created_at", "value":["' + fechaInicio + ' 01:00:00","' + fechaFinal + ' 23:59:59"]}]'
    //this.loadDataTable('historialgenerates?' + this.doWhere);
    //this.paginator.pageIndex = 0;
    //console.log(fechaInicio +"_"+fechaFinal)
    this.loadAll(fechaInicio, fechaFinal);
  }
  public exportTo(){
    
    if(this.fechaExcelInicio !=="" && this.fechaExcelFin !==""){
      window.open( this.api + 'reports/export/'+this.fechaExcelInicio+"_"+this.fechaExcelFin );

    }else{
          window.open( this.api + 'reports/export/' );

    }
  }
  convertFormatYear(range){
    var fecha = new Date(range)
    var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var anno = fecha.getFullYear();

    var fechaSearch;

    if (( mes + 1 ) < 10 ) {
      fechaSearch =   anno + '-' + 0 + (mes + 1) ;
    } else {
      fechaSearch =   anno + '-' + (mes + 1)  ;
    }


    if ( dia < 10 ) {
      fechaSearch = fechaSearch + '-' + 0 + (dia);
    } else {
      fechaSearch = fechaSearch + '-' + (dia);
    }

   

    

    return fechaSearch;

  }
  convertFormat(range){
    var fecha = new Date(range)
    var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var anno = fecha.getFullYear();

    var fechaSearch;
    if ( dia < 10 ) {
      fechaSearch =  0 + (dia);
    } else {
      fechaSearch =  (dia);
    }

    if (( mes + 1 ) < 10 ) {
      fechaSearch = fechaSearch  + '-' + 0 + (mes + 1) + '-' + anno;
    } else {
      fechaSearch = fechaSearch  + '-' + (mes + 1) + '-' + anno;
    }

    

    return fechaSearch;
  }
    //*  FUNCION PARA EL FILTRADO DESDE EL SELECTOR DE FECHAS

  
  reset(){
    /* this.form.myControl2.reset();*/
    this.form.nameButtonAceptar = 'Agregar';
    this.form.firstFormGroup.controls['client'].setValue('');
    this.form.firstFormGroup.controls['client_id'].setValue('');
    this.form.secondsFormGroup.controls['sucursal'].setValue('');
    this.form.secondsFormGroup.controls['sucursal_id'].setValue('');
    this.form.treeFormGroup.controls['observacion'].setValue('');

    this.form.myControl2.controls['myControl_ser'].setValue('');
    this.form.myControl2.controls['myControl_ser_id'].setValue('');

    this.form.myControl2.controls['peso'].setValue('');
    this.form.myControl2.controls['cantidad'].setValue('');
    this.form.myControl2.controls['myControl_color'].setValue('');
    this.form.myControl2.controls['myControl_color_id'].setValue('');

    this.form.myControl2.controls['myControl_sub'].setValue('');
    this.form.myControl2.controls['tipo'].setValue('');

    this.form.fruits2=[];
    this.form.myControl2.controls["fruitCtrl2"].setValue('');

    this.form.putSubmit = false;
    this.titleModal = "Crear Salida";
    this.form.personList = [];
    this.form.personList_entradas = [];
    this.form.stepper.selectedIndex = 0;
    this.form.idsubservicio6=0;
    this.form.vieneSucursal =false;
    this.form.validForm=true;
    this.form.totalPesoEntrada=0;
    this.form.totalPesoSalida=0;

    
  }
  showModal() {
    $("#basicModal").show();
    this.reset();
  }
  public closeModals(value) {
    this.reloadComponent();
    this.basicModal.hide();
  }
  public openEdit(id) {
    this.titleModal = "Crear Salidas";
    this.form.addForm(id);
  }
  public openEditParcial(id, idGrupo) {
    this.titleModal = "Editar Salida Parcial: "+idGrupo;
    this.form.addForm(id, idGrupo);
  }
  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf("/dashboard/Salidas") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
    //this.producEdit = [];
  }
  public applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    Object.keys(this.dataSource.filteredData).forEach((i, index) => {
      this.dataSource.filteredData[i].Item = index + 1;
    });
  }
  eliminarOp(id){
    let modulo ="deleteOp";
    this.dialog.open(SalidasDeleteComponent, {
     width: "450px",
     data: [id, modulo,0]
   });
  
  }
  eliminarGrupo(idGrupo){
    let modulo ="deleteGrupo";
    this.dialog.open(SalidasDeleteComponent, {
     width: "450px",
     data: [idGrupo, modulo,0]
   });
  
  }
  cerrarOp(id){
    this.dialog.open(SalidasCerrarComponent, {
     width: "450px",
     data: [id]
   });
  
  }
  print(id){
    window.open( this.api + 'reports/print/' + id);
   }
  printParcial(id,idGrupo){
    window.open( this.api + 'reports/printPartialOutput/'+ id+'/'+idGrupo);
   }
} 