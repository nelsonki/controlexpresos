
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LiquidationsServices } from "../../liquidations-services/liquidations-services";
import { userMsg } from "../../../../utils/const/message";
import { MatTableDataSource } from '@angular/material/table';
import { CoinsServices } from './../../../coins/coins-services/coins-services'
@Component({
  selector: 'app-liquidations-gastos',
  templateUrl: './liquidations-gastos.component.html',
  styleUrls: ['./liquidations-gastos.component.scss']
})
export class LiquidationsGastosComponent implements OnInit {
  public id: any;
  dataSource;
  dataSourceMontos;
  public element = [];
  public elementMontos = [];




  constructor(
    public dialogRef: MatDialogRef<LiquidationsGastosComponent>,
    public router: Router,
    private liquidationsServices: LiquidationsServices,
    private coinsServices: CoinsServices,
    public toasTer: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
    this.id = this.data;


  }
  ngOnInit() {

    console.log();

    this.liquidationsServices.getListPorIdLiquidacion(this.id).subscribe((value) => {
      this.element = [];
      this.elementMontos = [];
      console.log(value["data"])
      if (value["data"]) {
        this.element = [];
        this.elementMontos = [];

        Object.keys(value["data"].additionals).forEach(e => {

          const datos = {
            Item: "",
            "id": value["data"].additionals[e].id,
            "description": value["data"].additionals[e].description,
            "percent": value["data"].additionals[e].percent,
            "quantity": value["data"].additionals[e].quantity,
            "coin_id": value["data"].additionals[e].coin_id,

            "type": value["data"].additionals[e].type,

          };

          this.element.push(datos);

        });

        this.dataSource = new MatTableDataSource(this.element);

        Object.keys(value["data"].ammounts).forEach(e => {

          const datos2 = {
            Item: "",
            "id": value["data"].ammounts[e].id,
            "coin_id": value["data"].ammounts[e].coin.name,
            "quantity": value["data"].ammounts[e].quantity,


          };

          this.elementMontos.push(datos2);

        });
        this.dataSourceMontos = new MatTableDataSource(this.elementMontos);
        return this.dataSource, this.dataSourceMontos;
      } else {
        this.toasTer.error(value["message"]);
        this.element = [];
        this.elementMontos = [];
        this.dataSourceMontos = new MatTableDataSource(this.elementMontos);
        this.dataSource = new MatTableDataSource(this.element);
        return this.dataSource, this.dataSourceMontos;
      }
    });


  }



  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
    this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }


}
