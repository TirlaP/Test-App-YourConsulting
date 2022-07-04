import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, share } from 'rxjs';
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
import { PersoaneModalComponent } from './persoane-modal/persoane-modal.component';
import { CarServiceService } from '../masini/car-service.service';

@Component({
  selector: 'app-persoane',
  templateUrl: './persoane.component.html',
  styleUrls: ['./persoane.component.scss'],
})
export class PersoaneComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faChevronUp = faChevronUp;
  faPlus = faPlus;
  limit: number = 70;
  showBackTop: string = '';

  people: any = [];
  cars: any = [];
  currentCar: any;
  junction: any = [];
  id_person: any;

  // filtrare
  searchNume: string = '';
  searchCnp: string = '';
  searchVarsta: string = '';
  searchMasini: string = '';

  // ng-select options
  selectedCar: number | any;

  constructor(
    private _modal: NgbModal,
    private _spinner: NgxSpinnerService,
    private carService: CarServiceService
  ) {
    SET_HEIGHT('view', 20, 'height');
  }

  /*

  */

  ngOnInit(): void {
    this.loadData();
    this.loadCars();
    this.loadJunction();
    // this.getCar(13);
  }

  getCar = (id_car: number): void => {
    this.currentCar = this.cars.find((car: any) => car.id === id_car);
    // console.log(this.currentCar);
  };

  loadJunction = (): void => {
    this._spinner.show();
    axios
      .get('/api/junction')
      .then(({ data }) => {
        this.junction = data;
        this._spinner.hide();
      })
      .catch(() => toastr.error('Eroare la preluarea junctiunilor!'));
  };

  loadCars = (): void => {
    this._spinner.show();
    axios
      .get('/api/masini')
      .then(({ data }) => {
        this.cars = data;
        this._spinner.hide();
      })
      .catch(() => toastr.error('Eroare la preluarea masinilor!'));
  };

  loadData = (): void => {
    this._spinner.show();
    axios
      .get('/api/persoane')
      .then(({ data }) => {
        this.people = data;
        this._spinner.hide();
      })
      .catch(() => toastr.error('Eroare la preluarea persoanelor!'));
  };

  addEdit = (id_person?: number): void => {
    const modalRef = this._modal.open(PersoaneModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.id_person = id_person;
    modalRef.closed.subscribe(() => {
      this.loadJunction();
      this.loadData();
    });
  };

  delete = (person: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.title = `Ștergere persoana`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți persoana având numele si prenumele: <b>${person.nume} ${person.prenume}</b>?`;
    modalRef.closed.subscribe(() => {
      axios
        .delete(`/api/persoane/${person.id}`)
        .then(() => {
          toastr.success('Persoana a fost ștearsă cu succes!');
          this.loadData();
        })
        .catch(() => toastr.error('Eroare la ștergerea persoanei!'));
    });
  };

  Search() {
    // alert(this.searchText)
    if (
      this.searchNume !== '' &&
      this.searchCnp === '' &&
      this.searchVarsta === '' &&
      this.searchMasini === ''
    ) {
      let searchValue = this.searchNume?.toLocaleLowerCase();

      this.people = this.people.filter((person: any) => {
        return person.nume
          .concat(' ', person.prenume)
          .toLocaleLowerCase()
          .match(searchValue);
        // you can keep on adding object properties here
      });
    } else if (
      this.searchNume === '' &&
      this.searchCnp !== '' &&
      this.searchVarsta === '' &&
      this.searchMasini === ''
    ) {
      let searchValue = this.searchCnp?.toLocaleLowerCase();
      this.people = this.people.filter((person: any) => {
        return person.cnp.toLocaleLowerCase().match(searchValue);
      });
    } else if (
      this.searchNume === '' &&
      this.searchCnp === '' &&
      this.searchVarsta !== '' &&
      this.searchMasini === ''
    ) {
      let searchValue = this.searchVarsta?.toLocaleLowerCase();
      console.log(searchValue);
      this.people = this.people.filter((person: any) => {
        return person.age.toString().toLocaleLowerCase().match(searchValue);
      });
    } else if (
      this.searchNume === '' &&
      this.searchCnp === '' &&
      this.searchVarsta === '' &&
      this.searchMasini !== ''
    ) {
      let searchValue = this.searchMasini?.toLocaleLowerCase();
      this.people = this.people.filter((person: any) => {
        for (let j of this.junction) {
          this.getCar(j.id_car);
          if (
            j.id_person === person.id &&
            this.currentCar.marca
              .concat(' ', this.currentCar.model)
              .toLowerCase()
              .match(searchValue)
          ) {
            return person;
          }
        }
        // return person.marca.toLowerCase().match(searchValue);
        //<div *ngFor="let j of junction">
        // <tr *ngIf="j.id_person === r.id">
      });
    } else {
      this.loadData();
    }
  }

  /*

  Ce trebuie sa fac?

  Trebuie sa caut persoanele care au relatie cu masina cautata si sa le returnez spre afisare.

  Cum fac asta?

  1. Verific

  */

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
