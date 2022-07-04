import axios from 'axios';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { toastr } from '../../toastr/toastr.component';

@Component({
  selector: 'app-persoane-modal',
  templateUrl: './persoane-modal.component.html',
})
export class PersoaneModalComponent implements OnInit, OnChanges {
  @Input() id_person: number | any;

  // ng-select options
  selectedCar: number | any;

  cars: any = [];
  people: any = [];
  idPerson: any;
  currentCar: any;

  modal = {} as any;
  junction = { id_car: 13, id_person: 74 };
  message: string = '';

  // currentYear este de fapt 2022, dar am pus direct 22 pentru a usura calculele, deoarece avem nevoie doar de ultimele 2 cifre
  dataAge = {
    currentCNP: '0',
    bornPeriod: '0',
    year: '0',
    age: '0',
    currentYear: '22',
  };

  getCar = (): void => {
    // console.log(this.currentCar);
    console.log('audi');
  };

  constructor(
    private _spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    if (this.id_person) {
      this._spinner.show();
      axios
        .get(`/api/persoane/${this.id_person}`)
        .then(({ data }) => {
          this.modal = data;
          this._spinner.hide();
        })
        .catch(() => toastr.error('Eroare la preluarea persoanei!'));
    }
    this.loadCars();
    this.loadData();
  }

  loadCars = (): void => {
    this._spinner.show();
    axios
      .get('/api/masini')
      .then(({ data }) => {
        this.cars = data;
        this._spinner.hide();
      })
      .catch(() => toastr.error('Eroare la preluarea informațiilor!'));
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

  createAge(): void {
    // 5010606336678 - CNP
    // 010606 - Data Nasterii (2001/ 06/ 06)
    /* 
    Prima cifra:
      - 1 (barbati) si 2 (femei) -> nascuti intre 1900 si 1999
      - 3 (barbati) si 4 (femei) -> nascuti intre 1800 si 1899
      - 5 (barbati) si 6 (femei) -> nascuti intre 2000 si 2099
      - 7 (barbati) si 8 (femei) -> persoanele straine rezidente

    **** Cum rezolvam problema? ***

    1. Verificam in ce perioada s-a nascut persoana
    
    2. Verificam care este anul (urmatoarele 2 cifre)

    3. Daca sunt intre 2000 - 2099: scadem din anul curent (ultimele 2 cifre) anul nasterii (cifrele 2 si 3 din CNP)

    4. Daca sunt intre 1900 - 1999: adaugam un 1 in fata ultimelor 2 cifre din anul curent si scadem la fel ca mai sus

    5. Daca sunt intre 1800 - 1899: adaugam un 2 in fata ultimelor 2 cifre din anul curent si scadem la fel ca mai sus

    6. Putem implementa si daca am trecut de ziua persoanei anul asta sau nu, iar in functie de asta, facem -1 sau nu

    */
    this.dataAge.bornPeriod = this.modal.cnp?.substring(0, 1);
    this.dataAge.year = this.modal.cnp?.substring(1, 3);
    // this.dataAge.bornPeriod = this.modal.cnp.slice(0, 1).join('');
    // this.dataAge.year = this.modal.cnp.slice(1, 3).join('');
    this.dataAge.currentCNP = this.modal.cnp;

    // Gaseste modalitate de a optimiza codul
    if (
      parseInt(this.dataAge.bornPeriod) == 1 ||
      parseInt(this.dataAge.bornPeriod) == 2
    ) {
      this.modal.age =
        parseInt('1'.concat(this.dataAge.currentYear)) -
        parseInt(this.dataAge.year);
    } else if (
      parseInt(this.dataAge.bornPeriod) == 3 ||
      parseInt(this.dataAge.bornPeriod) == 4
    ) {
      this.modal.age =
        parseInt('2'.concat(this.dataAge.currentYear)) -
        parseInt(this.dataAge.year);
    } else if (
      parseInt(this.dataAge.bornPeriod) == 5 ||
      parseInt(this.dataAge.bornPeriod) == 6
    ) {
      this.modal.age =
        parseInt(this.dataAge.currentYear) - parseInt(this.dataAge.year);
    }
    console.log('RULARE');
  }

  ngOnChanges(changes: SimpleChanges): void {}

  save(): void {
    this._spinner.show();

    if (!this.id_person) {
      // this.idPerson = this.people[this.people.length - 1].id + 1;
      // this.junction.id_person = this.idPerson;
      // console.log(this.junction);
      axios
        .post('/api/persoane', this.modal)
        .then(() => {
          this._spinner.hide();
          toastr.success('Persoana a fost salvată cu succes!');
          this.activeModal.close();
        })
        .catch(() => toastr.error(`Eroare la salvarea persoanei!`));
    } else {
      axios
        .put('/api/persoane', this.modal)
        .then(() => {
          this._spinner.hide();
          toastr.success('Persoana a fost modificată cu succes!');
          this.activeModal.close();
        })
        .catch(() => toastr.error('Eroare la modificarea persoanei!'));

      // Parcurg masinile alese
      // Fac find pe id (element din selectedcars)

      axios
        .delete(`/api/junction/${this.modal.id}`)
        .then(() => {
          toastr.success('Jonctiunea a fost ștearsă cu succes!');
          this.loadData();
        })
        .catch(() => toastr.error('Eroare la ștergerea jonctiunii!'));

      console.log(this.modal.id);

      for (let carID of this.modal.selectedcars) {
        this.junction.id_person = this.modal.id;
        this.junction.id_car = parseInt(carID);

        console.log(carID);
        // console.log(this.junction); incearca asa sa vedem
        // seems like not

        axios
          .post('/api/junction', this.junction)
          .then(() => {
            this._spinner.hide();
            toastr.success('Jonctiunea a fost modificata cu succes!');
            this.activeModal.close();
          })
          .catch(() => toastr.error(`Eroare la modificarea jonctiunii!`));
      }
    }

    if (!this.id_person) {
      this.idPerson = this.people[this.people.length - 1].id + 1;
      this.junction.id_person = this.idPerson;
      console.log(this.junction);
      // for every selected car, I'll post it to /api/junction (Junction table with id_person and id_car)
      for (let carID of this.modal.selectedcars) {
        this.junction.id_car = parseInt(carID);

        // console.log(this.junction); incearca asa sa vedem
        // seems like not

        axios
          .post('/api/junction', this.junction)
          .then(() => {
            this._spinner.hide();
            toastr.success('Jonctiunea a fost salvată cu succes!');
            this.activeModal.close();
          })
          .catch(() => toastr.error(`Eroare la salvarea jonctiunii!`));
      }
    }
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere = [] as any;
    const splitTerm = term.split(' ').filter((t) => t);

    item = REPLACE_DIACRITICS(item.name);

    splitTerm.forEach((term) =>
      isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1)
    );
    const all_words = (this_word: any) => this_word;

    return isWordThere.every(all_words);
  }

  varsta(cnp: string): string {
    return '1';
  }
}
