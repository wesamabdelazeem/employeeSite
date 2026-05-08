import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import {PersonenService} from './personen.service';
import {ApiPerson} from '../models/ApiPerson';
import {ApiRolle,  getApiRolleDisplayValues} from '../models/ApiRolle';
import {getEnumKeyByValue} from './utils/enum.utils';
import {AbwesenheitService} from './abwesenheit.service';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  allowedRoles?: ApiRolle[];

  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {

  private readonly baseMenuItems: MenuItem[] = [
    {
      label: 'Anwesenheitsliste',
      icon: 'mdi-account-multiple-plus',
      route: '/anwesenheitsliste',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    //  allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE],

    },
    {
      label: 'Tätigkeiten buchen',
      icon: 'mdi-playlist-plus',
      route: '/taetigkeitebuchen',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },
    {
      label: 'Tätigkeiten historisch',
      icon: 'mdi-flip-h mdi-playlist-play',
      route: '/taetigkeitenhistorischlist',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },
    {
      label: 'Tätigkeiten korrigieren',
      icon: 'mdi-playlist-check',
      route: '/edit-activities',
      active: false,
    },


    {
      label: 'Abwesenheit',
      icon: 'mdi-account-remove',
      route: '/abwesenheit',
      active: false,
      allowedRoles: [ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },
    {
      label: 'Abwesenheit korrigieren',
      icon: 'mdi-account-remove',
      route: '/abwesenheit-korrigieren',
      active: true, // Default active tab
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },
    {
      label: 'Nachverrechnung',
      icon: 'mdi-contrast',
      route: '/calculation',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },
    {
      label: 'Bereitschaftszeiten',
      icon: 'mdi-phone',
      route: '/bereitschaftszeiten/343200000000078',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },
    {
      label: 'Bereitschaft korrigieren',
      icon: 'mdi-phone-log',
      route: '/bereitschaftkorrigieren',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },

    {
      label: 'Freigabe',
      icon: 'mdi-eye-outline',
      route: '/freigabe',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },
    {
      label: 'Freigabe korrigieren',
      icon: ' mdi-eye-check-outline',
      route: '/freigabe-korigieren',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },
    {
      label: 'Freigabe historisch',
      icon: 'mdi-eye-settings-outline',
      route: '/freigabe-historisch',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },

    {
      label: 'Stempelzeiten',
      icon: 'mdi-timer',
      route: '/stempelzeiten',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },

    {
      label: 'Personen',
      icon: 'mdi-account-edit',
      route: '/personen',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },

    {
      label: 'Produkte',
      icon: 'mdi-cards-outline',
      route: '/produkte',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },

    {
      label: 'Verträge',
      icon: 'mdi-file-document',
      route: '/vertraege-2',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },

    {
      label: 'Organisationseinheiten',
      icon: 'mdi-widgets',
      route: '/organisationseinheiten',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },
    {
      label: 'Zivildiener',
      icon: 'mdi-account-multiple-outline',
      route: '/zivildiener',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },
    {
      label: 'Auswertungen',
      icon: 'mdi-chart-line',
      route: '/reports',
      active: false,
      allowedRoles: [ApiRolle.DEFAULT, ApiRolle.ADMIN_PROJECT_OFFICE, ApiRolle.PROJECT_OFFICE, ApiRolle.ADMIN_LEITER],
    },
    {
      label: 'Beenden',
      icon: 'mdi-logout',
      route: '/exit',
      active: false,
    },
  ];

  private menuItemsSource = new BehaviorSubject<MenuItem[]>([]);
   private activeRouteSource = new BehaviorSubject<string>('/edit-absence');
  private currentUserSource = new BehaviorSubject<ApiPerson | null>(null);


  private menuItemsSource_ = new BehaviorSubject<MenuItem[]>([

    {
      label: 'Anwesenheitsliste',
      icon: 'mdi-account-multiple-plus',
      route: '/anwesenheitsliste',
      active: false,
    },
    {
      label: 'Tätigkeiten buchen',
      icon: 'mdi-playlist-plus',
      route: '/taetigkeitebuchen',
      active: false,
    },
    {
      label: 'Tätigkeiten historisch',
      icon: 'clock',
      route: '/taetigkeitenhistorischlist',
      active: false,
    },
    {
      label: 'Tätigkeiten korrigieren',
      icon: 'edit-2',
      route: '/edit-activities',
      active: false,
    },

  /*  {
      label: 'Abwesenheit-TEST-Re',
      icon: 'user-minus',
      route: '/abwesenheit-test-to-be-removed',
      active: false,
    }
    ,*/
    {
      label: 'Abwesenheit',
      icon: 'user-minus',
      route: '/abwesenheit',
      active: false,
    },
    {
      label: 'Abwesenheit korrigieren',
      icon: 'user-x',
      route: '/abwesenheit-korrigieren',
      active: true, // Default active tab
    },
    {
      label: 'Nachverrechnung',
      icon: 'calculator',
      route: '/calculation',
      active: false,
    },
    {
      label: 'Bereitschaftszeiten',
      icon: 'clock',
      route: '/bereitschaftszeiten/343200000000078',
      active: false,
    },
    {
      label: 'Bereitschaft korrigieren',
      icon: 'clock',
      route: '/bereitschaftkorrigieren',
      active: false,
    },

    {
      label: 'Freigabe',
      icon: 'check-circle',
      route: '/freigabe',
      active: false,
    },
    {
      label: 'Freigabe korrigieren',
      icon: 'check-circle',
      route: '/freigabe-korigieren',
      active: false,
    },
    {
      label: 'Freigabe historisch',
      icon: 'archive',
      route: '/freigabe-historisch',
      active: false,
    },

    {
      label: 'Stempelzeiten',
      icon: 'calendar',
      route: '/stempelzeiten',
      active: false,
    },

    {
      label: 'Personen',
      icon: 'users',
      route: '/personen',
      active: false,
    },

    {
      label: 'Produkte',
      icon: 'package',
      route: '/produkte',
      active: false,
    },

    {
      label: 'Verträge',
      icon: 'file-text',
      route: '/vertraege-2',
      active: false,
    },

    {
      label: 'Organisationseinheiten',
      icon: 'grid',
      route: '/organisationseinheiten',
      active: false,
    },
    {
      label: 'Zivildiener',
      icon: 'user',
      route: '/zivildiener',
      active: false,
    },
    {
      label: 'Auswertungen',
      icon: 'bar-chart-2',
      route: '/reports',
      active: false,
    },
    {
      label: 'Beenden',
      icon: 'log-out',
      route: '/exit',
      active: false,
    },
  ]);



  menuItems$ = this.menuItemsSource.asObservable();
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private personenService: PersonenService,
              private abwesenheitService: AbwesenheitService,
              private router: Router) {

    this.setCurrentUser(this.personenService.getCurrentUser());
    this.loadFilteredMenu();

    // Rebuild menu once the logged-in user arrives from the async initializer.
    this.personenService.currentUser$.subscribe(user => {
      this.currentUserSource.next(user);
      this.loadFilteredMenu();
    });
  }

  setCurrentUser(user: ApiPerson | null): void {
    this.currentUserSource.next(user);
  //  this.loadFilteredMenu(); // Re-filter menu when user changes
  }

  getCurrentUser(): ApiPerson | null {
    return this.personenService.getCurrentUser();// this.currentUserSource.value;
  }

  setActiveMenuItem(route: string): void {
    const updatedItems = this.menuItemsSource.value.map((item) => ({
      ...item,
      active: item.route === route,
    }));

    this.menuItemsSource.next(updatedItems);
    this.activeRouteSource.next(route);

   /* const cleanRoute = route.startsWith('/') ? route.substring(1) : route;
    if (cleanRoute === 'abwesenheit') {
      console.log('################## CURRENT ROUTe-1', cleanRoute);
      this.abwesenheitService.triggerRefresh();
    }else{
      console.log('################## CURRENT ROUTe', cleanRoute);

      this.router.navigateByUrl(cleanRoute);

    }

    */
  //  this.router.navigateByUrl(cleanRoute, { onSameUrlNavigation: 'reload' });

    // Navigate to the route without the leading slash
    /*if (route.startsWith('/')) {
      this.router.navigateByUrl(route.substring(1));
    }
    */
  }


  private loadFilteredMenu(): void {
    const currentUser = this.currentUserSource.value;
    const userRole = currentUser?.rolle;

    const filtered = this.baseMenuItems.filter(item => {
      if (!item.allowedRoles || item.allowedRoles.length === 0) {
        return true;
      }
      if (!userRole) {
        return false;
      }
      return item.allowedRoles.includes(userRole);
    });

    this.menuItemsSource.next(filtered);
  }



  getApiRolleKeyFromValue(value: string): string | undefined {
    if (!value) {
      return undefined;
    }

     const entry = Object.entries(ApiRolle).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;
  }


  isRouteVisible(route: string): boolean {
    const item = this.baseMenuItems.find(i => i.route === route);
    if (!item) return false;

    if (!item.allowedRoles || item.allowedRoles.length === 0) return true;

    const userRole = this.currentUserSource.value?.rolle;
    return userRole !== undefined && item.allowedRoles.includes(userRole);
  }

  getAllMenuItems(): MenuItem[] {
    return [...this.baseMenuItems];
  }

  refreshMenu(): void {
    this.loadFilteredMenu();
  }
}
