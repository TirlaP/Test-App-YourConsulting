import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import { Injectable, OnInit } from '@angular/core';
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { toastr } from '../toastr/toastr.component';
import { HttpClient } from '@angular/common/http';

const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class CarServiceService {
  courses = [
    { title: 'Hello Angular' },
    { title: 'Component Fundamentals' },
    { title: 'Template Driven Forms' },
    { title: 'Angular Services' },
    { title: 'Server Communication' },
    { title: 'Component Driven Architecture' },
    { title: 'Angular Routing' },
    { title: 'Unit Testing Fundamentals' },
  ];

  cars: any = [];
  model = '/api/masini';

  all() {
    return this.http.get(this.getUrl());
  }

  find(id: any) {
    return this.http.get(this.getUrlWithID(id));
  }

  create(car: any) {
    return this.http.post(this.getUrl(), car);
  }

  update(car: any) {
    return this.http.put(this.getUrlWithID(car.id), car);
  }

  delete(id: any) {
    return this.http.delete(this.getUrlWithID(id));
  }

  private getUrl() {
    return `${BASE_URL}${this.model}`;
  }

  private getUrlWithID(id: any) {
    return `${this.getUrl()}/${id}`;
  }

  loadData = (): void => {
    this._spinner.show();
    axios
      .get('/api/masini')
      .then(({ data }) => {
        this.cars = data;
        this._spinner.hide();
      })
      .catch(() => toastr.error('Eroare la preluarea informațiilor!'));
    console.log(this.cars);
  };

  constructor(private _spinner: NgxSpinnerService, private http: HttpClient) {}
}
