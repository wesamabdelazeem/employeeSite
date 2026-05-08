import { Routes } from '@angular/router';
import {
  AnwesenheitslisteListComponent
} from './components/anwesenheitsliste/anwesenheitsliste-list/anwesenheitsliste-list.component';
import {AbwesenheitListComponent} from './components/abwesenheit/abwesenheit-list/abwesenheit-list.component';
 import {AbwesenheitComponent} from './components/abwesenheit/abwesenheit/abwesenheit.component';
import {
  BereitschaftszeitenDetailsComponent
} from './components/bereitschaftszeiten/bereitschaftszeiten-details/bereitschaftszeiten-details.component';
import {
  BereitschaftKorrigierenDetailsComponent
} from './components/bereitschaft-korrigieren/bereitschaft-korrigieren-details/bereitschaft-korrigieren-details.component';
import {
  BereitschaftKorrigierenListComponent
} from './components/bereitschaft-korrigieren/bereitschaft-korrigieren-list/bereitschaft-korrigieren-list.component';
import {ZivildienerListComponent} from './components/zivildiener/zivildiener-list/zivildiener-list.component';
import {ZivildienerDetailComponent} from './components/zivildiener/zivildiener-detail/zivildiener-detail.component';
import {StempelzeitList2Component} from './components/stempelzeit/stempelzeit-list-2/stempelzeit-list-2.component';
import {
  StempelzeitDetails2Component
} from './components/stempelzeit/stempelzeit-details-2/stempelzeit-details-2.component';
import {FreigabeListComponent} from './components/freigabe/freigabe-list/freigabe-list.component';
import {
  FreigabeHistorischListComponent
} from './components/freigabe-historisch/freigabe-historisch-list/freigabe-historisch-list.component';
import {
  FreigabeKorigierenListComponent
} from './components/freigabe-korigieren/freigabe-korigieren-list/freigabe-korigieren-list.component';
import {VertragList2Component} from './components/vertrag-2/vertrag-list-2/vertrag-list-2.component';
import {VertragDetail2Component} from './components/vertrag-2/vertrag-detail-2/vertrag-detail-2.component';
import {PersonenListComponent} from './components/personen/personen-list/personen-list.component';
import {PersonenDetailComponent} from './components/personen/personen-detail/personen-detail.component';
import {ProdukteListComponent} from './components/produkte/produkte-list/produkte-list.component';
import {ProdukteDetailsComponent} from './components/produkte/produkte-details/produkte-details.component';
import {
  AbwesenheitKorrigierenListComponent
} from './components/abwesenheit-korrigieren/abwesenheit-korrigieren-list/abwesenheit-korrigieren-list.component';
import {
  AbwesenheitKorrigierenDetailComponent
} from './components/abwesenheit-korrigieren/abwesenheit-korrigieren-detail/abwesenheit-korrigieren-detail.component';
import {
  OrganisationeinheitenListComponent
} from './components/organisationeinheiten/organisationeinheiten-list/organisationeinheiten-list.component';
import {
  OrganisationeinheitenDetailsComponent
} from './components/organisationeinheiten/organisationeinheiten-details/organisationeinheiten-details.component';

import { refreshGuard } from './guards/refresh.guard';
import { TaetigkeitenBuchenComponent } from './components/taetigkeiten-buchen/taetigkeiten-buchen.component';
import { TatigkeitenHistorischListComponent } from './components/taetigkeiten-historisch/taetigkeiten-historisch-list/taetigkeiten-historisch-list.component';
import { TaetigkeitenHistorischDetailsComponent } from './components/taetigkeiten-historisch/taetigkeiten-historisch-details/taetigkeiten-historisch-details.component';
import { TaetigkeitenKorrigierenListComponent } from './components/taetigkeiten-korrigieren/taetigkeiten-korrigieren-list/taetigkeiten-korrigieren-list.component';
import { TaetigkeitenKorrigierenDetailsComponent } from './components/taetigkeiten-korrigieren/taetigkeiten-korrigieren-details/taetigkeiten-korrigieren-details.component';
import { NachverrechnungComponent } from './components/nachverrechnung/nachverrechnung.component';
import { AuswertungenComponent } from './components/auswertungen/auswertungen.component';
import { ExitComponent } from './components/exit/exit.component';

export const routes: Routes = [
  { path: 'anwesenheitsliste', component: AnwesenheitslisteListComponent },
  { path: 'abwesenheit', component: AbwesenheitComponent },
  { path: 'bereitschaftszeiten', component: BereitschaftszeitenDetailsComponent },
  { path: 'bereitschaftszeiten/:id', component: BereitschaftszeitenDetailsComponent ,  canActivate: [refreshGuard]},
  { path: 'bereitschaftkorrigieren', component: BereitschaftKorrigierenListComponent },
  { path: 'bereitschaftkorrigieren/:id', component: BereitschaftKorrigierenDetailsComponent ,  canActivate: [refreshGuard]},
  { path: 'zivildiener', component: ZivildienerListComponent },
  { path: 'zivildiener/:id', component: ZivildienerDetailComponent ,  canActivate: [refreshGuard]},
  { path: 'stempelzeiten', component: StempelzeitList2Component },
  { path: 'stempelzeiten/:id', component: StempelzeitDetails2Component ,  canActivate: [refreshGuard]},

  { path: 'freigabe', component: FreigabeListComponent },
  { path: 'freigabe-historisch', component: FreigabeHistorischListComponent },
  { path: 'freigabe-korigieren', component: FreigabeKorigierenListComponent },

  { path: 'vertraege-2', component: VertragList2Component },
  { path: 'vertraege-2/:id', component: VertragDetail2Component,  canActivate: [refreshGuard] },

  { path: 'personen', component: PersonenListComponent },
  { path: 'personen/:id', component: PersonenDetailComponent,  canActivate: [refreshGuard] },
  { path: 'personen/neu', component: PersonenDetailComponent,  canActivate: [refreshGuard] },

  { path: 'produkte', component: ProdukteListComponent },
  { path: 'produkte/neu', component: ProdukteDetailsComponent },
  { path: 'produkte/:id', component: ProdukteDetailsComponent },


  { path: 'abwesenheit-korrigieren', component: AbwesenheitKorrigierenListComponent },
  { path: 'abwesenheit-korrigieren/:id', component: AbwesenheitKorrigierenDetailComponent,  canActivate: [refreshGuard] },

  { path: 'organisationseinheiten', component: OrganisationeinheitenListComponent },
  { path: 'organisationseinheiten/:id', component: OrganisationeinheitenDetailsComponent,  canActivate: [refreshGuard] },


  { path: 'edit-activities', component: TaetigkeitenKorrigierenListComponent },
  { path: 'edit-activities/:id', component: TaetigkeitenKorrigierenDetailsComponent, canActivate: [refreshGuard] },
  { path: 'taetigkeitebuchen', component: TaetigkeitenBuchenComponent },
  { path: 'taetigkeitenhistorischlist', component: TatigkeitenHistorischListComponent },
  { path: 'taetigkeitenhistorischlist/:id', component: TaetigkeitenHistorischDetailsComponent, canActivate: [refreshGuard] },
  { path: 'calculation', component: NachverrechnungComponent },
  { path: 'reports', component: AuswertungenComponent },
  { path: 'exit', component: ExitComponent },

  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' }


];
