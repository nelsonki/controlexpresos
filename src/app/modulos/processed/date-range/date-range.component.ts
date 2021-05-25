import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Range, NgxDrpOptions, PresetItem } from './modules/ngx-mat-drp/model/model';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit {
  range: Range = {fromDate: new Date(), toDate: new Date()};
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];

  @Output() dateNow = new EventEmitter();


  ngOnInit() {
    let today = new Date();
    let fromMin = new Date(today.getFullYear(), today.getMonth()-2, 1);
    let fromMax = new Date(today.getFullYear(), today.getMonth()+1, 0);
    let toMin = new Date(today.getFullYear(), today.getMonth()-1, 1);
    let toMax = new Date(today.getFullYear(), today.getMonth()+2, 0);

    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: 'mediumDate',
      range: {fromDate: today, toDate: today},
      applyLabel: "Submit"
      // excludeWeekends:true,
      // fromMinMax: {fromDate:fromMin, toDate:fromMax},
      // toMinMax: {fromDate:toMin, toDate:toMax},
    };
  }

  updateRange(range: Range) {
     this.range = range;
     this.dateNow.emit(this.range);
  }

  getRange(){
    return this.range;
  }

  setupPresets() {
    let backDate = (numOfDays) => {
      let today = new Date();
      return new Date(today.setDate(today.getDate() - numOfDays));
    };

    let today = new Date();
    let yesterday = backDate(1);
    let minus7 = backDate(7)
    let minus30 = backDate(30);
    let currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    let currMonthEnd = new Date(today.getFullYear(), today.getMonth()+1, 0);
    let lastMonthStart = new Date(today.getFullYear(), today.getMonth()-1, 1);
    let lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    this.presets =  [
        { presetLabel: "Hoy", range: {fromDate: today, toDate: today}},
        { presetLabel: "Ayer", range: {fromDate: yesterday, toDate: yesterday}},
        { presetLabel: "Últimos 7 días", range: {fromDate: minus7, toDate: today}},
        { presetLabel: "Últimos 30 días", range: {fromDate: minus30, toDate: today}},
        { presetLabel: "Mes actual", range: {fromDate: currMonthStart, toDate: currMonthEnd}},
        { presetLabel: "Último mes", range: {fromDate: lastMonthStart, toDate: lastMonthEnd}}
    ];
  }
}
