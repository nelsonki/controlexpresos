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
//import { TemplateMsg } from "../../../utils/const/message";
import { ToastrService } from "ngx-toastr";
//import { TemplatesService } from '../templates-services/templates.service';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-entradas-form',
  templateUrl: './entradas-form.component.html',
  styleUrls: ['./entradas-form.component.scss']
})
export class EntradasFormComponent implements OnInit {
  @Input() element: string  ;
  @Output() statusCloseModal = new EventEmitter();
  
  public firstform: FormGroup ;
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


  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    //public templatesService: TemplatesService
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({ 
      dni: ["", Validators.required],
      nombre: ["", Validators.required],
      direccion: ["", Validators.required],
      telefono: ["", Validators.required],
      email: ["", Validators.required]
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
}
