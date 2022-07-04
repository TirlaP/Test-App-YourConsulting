import axios from 'axios';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { toastr } from '../../toastr/toastr.component';

@Component({
  selector: 'app-masini-modal',
  templateUrl: './masini-modal.component.html',
})
export class MasiniModalComponent implements OnInit {
  @Input() id_car: number | undefined;

  modal = {} as any;

  dataCap = {
    currentCap: '0',
  };

  constructor(
    private _spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    if (this.id_car) {
      this._spinner.show();
      axios
        .get(`/api/masini/${this.id_car}`)
        .then(({ data }) => {
          this.modal = data;
          this._spinner.hide();
        })
        .catch(() => toastr.error('Eroare la preluarea masinii!'));
    }
  }

  /*
    Rezolvare problema

  1. verificam capacitatea cilindrica curenta
  2. Daca cap < 1500 -> taxa = 50 RON
  3. Daca cap >= 1500 && cap <= 2000 -> taxa = 100 RON
  4. Daca cap > 2000 -> taxa = 200 RON
  */

  createTax(): void {
    this.dataCap.currentCap = this.modal.capacitate;
    if (parseInt(this.modal.capacitate) < 1500) {
      this.modal.taxa = 50;
    } else if (
      parseInt(this.modal.capacitate) >= 1500 &&
      parseInt(this.modal.capacitate) <= 2000
    ) {
      this.modal.taxa = 100;
    } else if (parseInt(this.modal.capacitate) > 2000) {
      this.modal.taxa = 200;
    }
    console.log('RULARE');
  }

  ngOnChanges(changes: SimpleChanges): void {}

  save(): void {
    this._spinner.show();

    if (!this.id_car) {
      console.log(this.modal);
      axios
        .post('/api/masini', this.modal)
        .then(() => {
          this._spinner.hide();
          toastr.success('Masina a fost salvată cu succes!');
          this.activeModal.close();
        })
        .catch(() => toastr.error(`Eroare la salvarea masinii!`));
    } else {
      axios
        .put('/api/masini', this.modal)
        .then(() => {
          this._spinner.hide();
          toastr.success('Masina a fost modificată cu succes!');
          this.activeModal.close();
        })
        .catch(() => toastr.error('Eroare la modificarea masinii!'));
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
}
