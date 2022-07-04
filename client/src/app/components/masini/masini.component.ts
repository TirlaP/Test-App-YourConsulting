import axios from 'axios';
import { Component, Injectable, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { MasiniModalComponent } from './masini-modal/masini-modal.component';
import { CarServiceService } from './car-service.service';

@Component({
  selector: 'app-masini',
  templateUrl: './masini.component.html',
  styleUrls: ['./masini.component.scss'],
})
export class MasiniComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faChevronUp = faChevronUp;
  faPlus = faPlus;
  limit: number = 70;
  showBackTop: string = '';
  cars: any = [];

  searchMarca: string = '';
  searchModel: string = '';
  searchFabricatie: string = '';
  searchCapacitate: string = '';
  searchTaxa: string = '';

  courses: any = [];
  model = '/api/masini';

  constructor(
    private _modal: NgbModal,
    private _spinner: NgxSpinnerService,
    private carService: CarServiceService
  ) {
    SET_HEIGHT('view', 20, 'height');
  }

  ngOnInit(): void {
    this.loadData();
    this.fetchCourses();
    // this.cars = this.carService.cars;
  }

  Search() {
    // alert(this.searchText)
    if (
      this.searchMarca !== '' &&
      this.searchModel === '' &&
      this.searchFabricatie === '' &&
      this.searchCapacitate === '' &&
      this.searchTaxa === ''
    ) {
      let searchValue = this.searchMarca?.toLocaleLowerCase();

      this.cars = this.cars.filter((car: any) => {
        return car.marca.toLocaleLowerCase().match(searchValue);
        // you can keep on adding object properties here
      });

      console.log(this.cars);
    } else if (
      this.searchMarca === '' &&
      this.searchModel !== '' &&
      this.searchFabricatie === '' &&
      this.searchCapacitate === '' &&
      this.searchTaxa === ''
    ) {
      let searchValue = this.searchModel?.toLocaleLowerCase();
      this.cars = this.cars.filter((car: any) => {
        return car.model.toLocaleLowerCase().match(searchValue);
      });
    } else if (
      this.searchMarca === '' &&
      this.searchModel === '' &&
      this.searchFabricatie !== '' &&
      this.searchCapacitate === '' &&
      this.searchTaxa === ''
    ) {
      let searchValue = this.searchFabricatie?.toLocaleLowerCase();
      console.log(searchValue);
      this.cars = this.cars.filter((car: any) => {
        return car.fabricatie.toString().toLocaleLowerCase().match(searchValue);
      });
    } else if (
      this.searchMarca === '' &&
      this.searchModel === '' &&
      this.searchFabricatie === '' &&
      this.searchCapacitate !== '' &&
      this.searchTaxa === ''
    ) {
      let searchValue = this.searchCapacitate?.toLocaleLowerCase();
      this.cars = this.cars.filter((car: any) => {
        return car.capacitate.toString().toLocaleLowerCase().match(searchValue);
      });
    } else if (
      this.searchMarca === '' &&
      this.searchModel === '' &&
      this.searchFabricatie === '' &&
      this.searchCapacitate === '' &&
      this.searchTaxa !== ''
    ) {
      let searchValue = this.searchTaxa?.toLocaleLowerCase();
      this.cars = this.cars.filter((car: any) => {
        return car.taxa.toString().toLocaleLowerCase().match(searchValue);
      });
    } else {
      this.loadData();
    }
  }

  fetchCourses() {
    // axios.get(`${this.model}`).then(({data} )=> { this.courses = data; })
    this.carService.all().subscribe((result: any) => (this.courses = result));
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
  };

  addEdit = (id_car?: number): void => {
    console.log(id_car);
    const modalRef = this._modal.open(MasiniModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.id_car = id_car;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  };

  delete = (car: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.title = `Ștergere masina`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți masina având marca <b>${car.marca}</b>, si modelul: <b>${car.model}</b>?`;
    modalRef.closed.subscribe(() => {
      axios
        .delete(`/api/masini/${car.id}`)
        .then(() => {
          toastr.success('Masina a fost ștearsă cu succes!');
          this.loadData();
        })
        .catch(() => toastr.error('Eroare la ștergerea masinii!'));
    });
  };

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (
      document.getElementsByClassName('view-scroll-informations')[0].scrollTop >
      500
    ) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-informations', 0);
    this.limit = 70;
  }
}
