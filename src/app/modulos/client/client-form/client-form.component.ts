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
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  @Input() element: string  ;
  @Output() statusCloseModal = new EventEmitter();
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

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
  public profileImage2=null;
  public loadImg: any = '';


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
  projectImage2(file1: File) {
    this.loadImg = file1;
    if ( file1){
        let reader = new FileReader;
        reader.onload = (e: any) => {
            this.profileImage2 = e.target.result;
            this.onChange.emit(file1);
        };
        reader.readAsDataURL(file1);
    } else{
      this.profileImage2 = '';
    }
  }
  updateSource2($event: Event) {
    this.projectImage2($event.target['files'][0]);
  }
  onSubmit(){}
  get f() {
    return this.firstform.controls;
  }
}
