import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationComponent } from './components/information/information.component';
import { MasiniComponent } from './components/masini/masini.component';
import { PersoaneComponent } from './components/persoane/persoane.component';

const routes: Routes = [
  { path: 'information', component: InformationComponent },
  { path: 'persoane', component: PersoaneComponent },
  { path: 'masini', component: MasiniComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
