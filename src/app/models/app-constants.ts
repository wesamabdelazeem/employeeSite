export class AppConstants {


    //static readonly BASE_URL: string = 'http://localhost:29200/at.gv.bmi.getit3-d/srv/v1';
    static readonly BASE_URL: string = 'https://stportal.bmi.intra.gv.at/at.gv.bmi.getit3-e/gui/getitgui/proxy/v1';

    static readonly API_URL_PRODUKTE : string = AppConstants.BASE_URL + '/produkte';

    static readonly API_URL_PRODUKT_POSITIONEN : string = AppConstants.BASE_URL + '/produktPositionen';



    static readonly API_URL_PERSONEN_ANWESEND : string = AppConstants.BASE_URL + '/personen:anwesend';

    static readonly API_URL_ORGANISATION_EINHEITEN : string = AppConstants.BASE_URL + '/organisationseinheiten';

    static readonly API_URL_ANWESENHEITSLISTE_DETAIL : string = AppConstants.BASE_URL + '/stempelzeiten';

    static readonly API_URL_ABWESENHEIT : string = AppConstants.BASE_URL + '/stempelzeiten';

    static readonly API_URL_STEMPELZEITEN : string = AppConstants.BASE_URL + '/stempelzeiten';


    static readonly API_URL_PERSONEN : string = AppConstants.BASE_URL + '/personen';


    static readonly API_URL_FREIGABE_POSITIONEN: string = AppConstants.BASE_URL + '/freigabePositionen';

    // Verträge
    static readonly API_URL_VERTRAEGE: string = AppConstants.BASE_URL + '/vertraege';

  // Response Messages
  static readonly MSG_PERSONEN_LOADED_SUCCESS = 'Personen wurden erfolgreich geladen';
  static readonly MSG_PERSONEN_LOADED_ERROR = 'Personen wurden nicht geladen';

  static readonly MSG_ABWESENHEITEN_LOADED_SUCCESS = 'Abwesenheiten wurden erfolgreich geladen';
  static readonly MSG_ABWESENHEITEN_UPDATED_SUCCESS = 'Die Abwesenheit wurde erfolgreich geändert';
  static readonly MSG_ABWESENHEITEN_CREATED_SUCCESS = 'Die Abwesenheit wurde erfolgreich erzeugt';
  static readonly MSG_ABWESENHEITEN_DELETED_SUCCESS = 'Die Abwesenheit wurde erfolgreich gelöscht ';
  static readonly MSG_ABWESENHEITEN_SEND_CALENDAR_SUCCESS = 'Die Abwesenheit wurde erfolgreich exportiert ';



  static readonly MSG_ABWESENHEITEN_LOADED_ERROR = 'Abwesenheiten wurden nicht geladen';
  static readonly MSG_ABWESENHEITEN_UPDATED_ERROR = 'Die Abwesenheit wurde nicht geändert';
  static readonly MSG_ABWESENHEITEN_CREATED_ERROR = 'Die Abwesenheit wurde nicht erzeugt';
  static readonly MSG_ABWESENHEITEN_DELETED_ERROR = 'Die Abwesenheit wurde nicht gelöscht ';


  static readonly MSG_STEMPELZEITEN_LOADED_SUCCESS = 'Stempelzeit wurden erfolgreich geladen';
  static readonly MSG_STEMPELZEITEN_UPDATED_SUCCESS = 'Die Stempelzeit wurde erfolgreich geändert';
  static readonly MSG_STEMPELZEITEN_CREATED_SUCCESS = 'Die Stempelzeit wurde erfolgreich erzeugt';
  static readonly MSG_STEMPELZEITEN_DELETED_SUCCESS = 'Die Stempelzeit wurde erfolgreich gelöscht ';
  static readonly MSG_STEMPELZEITEN_SEND_CALENDAR_SUCCESS = 'Die Stempelzeit wurde erfolgreich exportiert ';



  static readonly MSG_STEMPELZEITEN_LOADED_ERROR = 'Stempelzeit wurden nicht geladen';
  static readonly MSG_STEMPELZEITEN_UPDATED_ERROR = 'Die Stempelzeit wurde nicht geändert';
  static readonly MSG_STEMPELZEITEN_CREATED_ERROR = 'Die Stempelzeit wurde nicht erzeugt';
  static readonly MSG_STEMPELZEITEN_DELETED_ERROR = 'Die Stempelzeit wurde nicht gelöscht ';


  static readonly MSG_ANWESENHEITEN_LOADED_SUCCESS = 'Anwesenheiten wurden erfolgreich geladen';
  static readonly MSG_ANWESENHEITEN_LOADED_ERROR = 'Anwesenheiten wurden nicht geladen';


  static readonly MSG_TAETIGKEITEN_LOADED_SUCCESS = 'Tätigkeitsbuchungen wurden erfolgreich geladen';
  static readonly MSG_TAETIGKEITEN_LOADED_ERROR = 'Tätigkeitsbuchungen wurden nicht geladen';

  static readonly MSG_TAETIGKEITEN_CREATED_SUCCESS = 'Die Tätigkeitsbuchung wurde erfolgreich erzeugt';
  static readonly MSG_TAETIGKEITEN_CREATED_ERROR = 'Die Tätigkeitsbuchung wurde nicht erzeugt';
  static readonly MSG_TAETIGKEITEN_UPDATED_SUCCESS = 'Die Tätigkeitsbuchung wurde erfolgreich geändert';
  static readonly MSG_TAETIGKEITEN_UPDATED_ERROR = 'Die Tätigkeitsbuchung wurde nicht geändert';
  static readonly MSG_TAETIGKEITEN_DELETED_SUCCESS = 'Die Tätigkeitsbuchung wurde erfolgreich gelöscht';
  static readonly MSG_TAETIGKEITEN_DELETED_ERROR = 'Die Tätigkeitsbuchung wurde nicht gelöscht';

  static getFunctionValue(label: string): string {
        const item = PERSON_FUNCTION_TYPEN.find(item => item.label === label);
        return item ? item.value : label; // fallback to value if not found
      }


      static  getRechtValue(label: string): string {
        const item = RECHT_TYPEN.find(item => item.label === label);
        return item ? item.value : label;
      }
 }

 export const RECHT_TYPEN = [
    { value: 'STEMPELN', label: 'stempeln' },
    { value: 'FREIER_LAN_ZUGANG', label: 'freier LAN Zugang' },
    { value: 'REMOTE_USER', label: 'Remote User' },
    { value: 'BEREITSCHAFT', label: 'Bereitschaft' },
    { value: 'ONLINE_STEMPELN_BUERO', label: 'Online Stempeln Büro' },
    { value: 'ONLINE_STEMPELN_HOMEOFFICE', label: 'Online Stempeln Homeoffice' },
    { value: 'TELEARBEITER', label: 'Telearbeiter' }
  ];


 export const PERSON_FUNCTION_TYPEN = [
    { value: 'TEAMLEITER', label: 'Teamleiter' },
    { value: 'ABTEILUNGSLEITER', label: 'Abteilungsleiter' },
 ]  ;

 // Arrays for dropdown-lists
 export const POSITION_TYPEN = [
    { value: 'PROJEKT', label: 'Projekt' },
    { value: 'KLEINPROJEKT', label: 'Kleinprojekt' },
    { value: 'CHANGE_REQUEST', label: 'Change Request' },
    { value: 'WARTUNG', label: 'Wartung' }
 ]  ;


  export const PRODUKT_TYPEN = [
    { value: 'ANWENDUNG', label: 'Anwendung' },
    { value: 'ADMINISTRATION', label: 'Administration' },
    { value: 'ZENTRALE_KOMPONENTE', label: 'zentrale Komponente' },
   ] ;



   export const GESCHLECHT_TYPEN = [
    { value: 'WEIBLICH', label: 'weiblich' },
    { value: 'INTER', label: 'inter' },
    { value: 'MAENNLICH', label: 'männlich' },
    { value: 'DIVERS', label: 'divers' },
    { value: 'OFFEN', label: 'offen' },
    { value: 'KEINE_ANGABE', label: 'keine Angabe' },

   ];




   export const MITARBEITER_TYPEN = [
    { value: 'INTERN', label: 'intern' },
    { value: 'EXTERN', label: 'extern' },
    { value: 'DIENSTVERWENDUNG', label: 'Dienstverwendung' },
    { value: 'ZIVILDIENSTLEISTENDER', label: 'Zivildienstleistender' },
    { value: 'LEHRLING', label: 'Lehrling' },
    { value: 'PRAKTIKANT', label: 'Praktikant' },
    { value: 'PAYROLL', label: 'Payroll' },
    { value: 'EXTERN_OHNE_BAKS', label: 'extern ohne BAKS' },
   ];





   export const GETITROLLE_TYPEN = [
    { value: 'DEFAULT', label: 'Default' },
    { value: 'PROJECT_OFFICE', label: 'ProjectOffice' },
    { value: 'PROJECT_OFFICE_READ_ONLY', label: 'ProjectOffice Read Only' },
    { value: 'ADMIN_PROJECT_OFFICE', label: 'Admin ProjectOffice' },
    { value: 'ADMIN_LEITER', label: 'Admin Leiter' },
   ] ;


   export const BUCHER_TYPEN = [
    { value: 'KEIN_BUCHER', label: 'kein Bucher' },
    { value: 'LIMITIERTER_BUCHER', label: 'limitierter Bucher' },
    { value: 'GEPLANTER_BUCHER', label: 'geplanter Bucher' },
    { value: 'FREIER_BUCHER', label: 'freier Buche' },
   ] ;


   export const DIENSTVERWENDUNG_TYPEN = [
    { value: 'ADMINISTRATOR_IN', label: 'Administrator/in', active: true },
    { value: 'AGILE_COACH', label: 'Agile Coach', active: true },
    { value: 'ASSISTENT_IN', label: 'Assistent/in', active: true },
    { value: 'AUSBILDUNGSBEAUFTRAGTE_R', label: 'Ausbildungsbeauftragte/in', active: true },
    { value: 'DATENBANKADMINISTRATOR_IN', label: 'Datenbankadministrator/in', active: true },
    { value: 'DEMAND_MANAGER_IN', label: 'Demand Manager/in', active: true },
    { value: 'DEVELOPER', label: 'Developer', active: true },
    { value: 'ENTERPRISE_ARCHITEKT_IN', label: 'Enterprise Architekt/in', active: true },
    { value: 'HAUSTECHNIKER_IN', label: 'Haustechniker/in', active: true },
    { value: 'INFRASTRUKTUR_ARCHITEKT_IN', label: 'Infrastruktur Architekt/in', active: true },
    { value: 'IT_ANALYST_IN', label: 'IT-Analyst/in', active: true },
    { value: 'IT_CONSULTANT', label: 'IT-Consultant', active: true },
    { value: 'IT_MANAGER_IN', label: 'IT-Manager/in', active: true },
    { value: 'IT_SUPPORT', label: 'IT-Support', active: true },
    { value: 'NETZWERKADMINISTRATOR_IN', label: 'Netzwerkadministrator/in', active: true },
    { value: 'PORTIERFUNKTION', label: 'Platform Engineer', active: true },
    { value: 'PRODUCT_OWNER', label: 'Product Owner', active: true },
    { value: 'PROJEKTLEITER_IN', label: 'Projektleiter/in', active: true },
    { value: 'PROJEKTMANAGER_IN', label: 'Projektmanager/in', active: true },
    { value: 'SERVICEMANAGER_IN', label: 'Servicemanager/in', active: true },
    { value: 'SOFTWARE_ARCHITEKT_IN', label: 'Software Architekt/in', active: true },
    { value: 'SOFTWARE_DEVELOPER_IN', label: 'Software Developer/in', active: true },
    { value: 'SYSTEMADMINISTRATOR_IN', label: 'Systemadministrator/in', active: true },
    { value: 'TEST_ARCHITEKT_IN', label: 'Test Architekt/in', active: true },
    { value: 'TEST_ENGINEER', label: 'Test Engineer', active: true },
    { value: 'TEST_MANAGER_IN', label: 'Test Manager/in', active: true },
    { value: 'ZIVILDIENSTLEISTENDER', label: 'Zivildienstleistender', active: true },

    // Alte Dienstverwendungen (inactive)
    { value: 'PRAKTIKANT_IN', label: 'Praktikant(in)', active: false },
    { value: 'REFERENT_IN', label: 'Referent(in)', active: false },
    { value: 'LEITER_IN', label: 'Leiter(in)', active: false },
    { value: 'SEKRETAER_IN', label: 'Sekretär(in)', active: false },
    { value: 'BENUTZERBETREUER_IN', label: 'Benutzerbetreuer(in)', active: false },
    { value: 'ARBEITSVORBEREITUNG_OPERATOR', label: 'Arbeitsvorbereitung-Operator', active: false },
    { value: 'ARBEITSBETREUER_IN', label: 'Arbeitsbetreuer(in)', active: false },
    { value: 'OPERATOR', label: 'Operator', active: false },
    { value: 'ARBEITSVORBEREITUNG_PROGRAMMIERER_IN', label: 'Arbeitsvorbereitung-Programmierer(in)', active: false },
    { value: 'PROGRAMMIERER_IN', label: 'Programmierer(in)', active: false },
    { value: 'CHEFOPERATOR', label: 'Chefoperator', active: false },
    { value: 'REFERATSLEITER_IN', label: 'Referatsleiter(in)', active: false },
    { value: 'STELLVERTRETENDE_R_LEITER_IN', label: 'stellvertretende(r) Leiter(in)', active: false },
    { value: 'STELLVERTRETENDE_R_REFERATSLEITER_IN', label: 'stellvertretende(r) Referatsleiter(in)', active: false },
    { value: 'NETZWERKADMINISTRATOR_ASSISTENT_IN', label: 'Netzwerkadministrator-Assistent(in)', active: false },
    { value: 'CHEFORGANISATOR_IN', label: 'Cheforganisator(in)', active: false },
    { value: 'ORGANISATOR_IN', label: 'Organisator(in)', active: false },
    { value: 'ORGANISATIONSASSISTENT_IN', label: 'Organisationsassistent(in)', active: false },
    { value: 'ANALYTIKERASSISTENT_IN', label: 'Analytikerassistent(in)', active: false },
    { value: 'CHEFANALYTIKER_IN', label: 'Chefanalytiker(in)', active: false },
    { value: 'ARBEITER_IN', label: 'Arbeiter(in)', active: false },
    { value: 'AMTSWART_IN', label: 'Amtswart(in)', active: false },
    { value: 'TEAMASSISTENT_IN', label: 'Teamassistent(in)', active: false },
    { value: 'KOORDINATOR_IN', label: 'Koordinator(in)', active: false },
    { value: 'BETREUER_IN', label: 'Betreuer(in)', active: false },
    { value: 'OPERATOR_IN_AUSBILDUNG', label: 'Operator in Ausbildung', active: false },
    { value: 'ANALYTIKER_IN', label: 'Analytiker(in)', active: false },
    { value: 'RICHTFUNKTION_F_D_BEDIENSTETENGRUPPE_2', label: 'Richtfunktion f.d. Bedienstetengruppe 2', active: false },
    { value: 'APPLIKATIONSADMINISTRATOR_IN', label: 'Applikationsadministrator(in)', active: false },
    { value: 'APPLIKATIONSLEITER_IN', label: 'Applikationsleiter(in)', active: false },
    { value: 'CHEF_DATENBANKORGANISATOR_IN', label: 'Chef-Datenbankorganisator(in)', active: false },
    { value: 'CHEF_NETZWERKORGANISATOR_IN', label: 'Chef-Netzwerkorganisator(in)', active: false },
    { value: 'SYSTEMORGANISATOR_IN', label: 'Systemorganisator(in)', active: false },
    { value: 'LEITER_IN_DER_SOFTWARE', label: 'Leiter(in) der Software', active: false },
    { value: 'LEITER_IN_IT_DIENST', label: 'Leiter(in) IT-Dienst', active: false },
    { value: 'CHEFPROGRAMMIERER_IN', label: 'Chefprogrammierer(in)', active: false },
    { value: 'LEITER_IN_VERARBEITUNG', label: 'Leiter(in) Verarbeitung', active: false },
    { value: 'LEITER_IN_ARBEITSVORBEREITUNG', label: 'Leiter(in) Arbeitsvorbereitung', active: false },
    { value: 'LEITER_IN_BENUTZERBETREUUNG', label: 'Leiter(in) Benutzerbetreuung', active: false },
    { value: 'LEITER_IN_OPERATION', label: 'Leiter(in) Operation', active: false },
    { value: 'SENIORPROGRAMMIERER_IN', label: 'Seniorprogrammierer(in)', active: false },
    { value: 'SYSTEMPROGRAMMIERER_IN', label: 'Systemprogrammierer(in)', active: false },
    { value: 'AUSBILDUNGSBEAUFTRAGTER_ASSISTENT_IN', label: 'Ausbildungsbeauftragter-Assistent(in)', active: false },
    { value: 'ARBEITSVORBEREITUNG_SYSTEMOPERATOR_IN', label: 'Arbeitsvorbereitung-Systemoperator(in)', active: false },
    { value: 'BENUTZERBETREUER_ASSISTENT_IN', label: 'Benutzerbetreuer-Assistent(in)', active: false },
    { value: 'LEITER_IN_DATENERFASSUNG', label: 'Leiter(in) Datenerfassung', active: false },
    { value: 'PROGRAMMIERASSISTENT_IN', label: 'Programmierassistent(in)', active: false },
    { value: 'SYSTEMOPERATOR_IN', label: 'Systemoperator(in)', active: false },
    { value: 'GRUPPENLEITER_IN_DATENERFASSUNG', label: 'Gruppenleiter(in) Datenerfassung', active: false },
    { value: 'ORGANISATOR_IN_ANALYTIKER_IN', label: 'Organisator(in)/Analytiker(in)', active: false },
    { value: 'ORGANISATIONSASSISTENT_IN_ANALYTIKERASSISTENT_IN', label: 'Organisationsassistent(in)/Analytikerassistent(in)', active: false },
    { value: 'SEKRETARIATSLEITER_IN', label: 'Sekretariatsleiter(in)', active: false },
    { value: 'TESTER_IN', label: 'Tester(in)', active: false },
    { value: 'ARCHITEKT_IN', label: 'Architekt(in)', active: false },
    { value: 'REQUIREMENTS_ENGINEER', label: 'Requirements Engineer', active: false }
  ] ;


  export const FREIGABEGRUPPE_TYPEN = [
    { value: 'EBF_LINUX', label: 'eBF Linux' },
    { value: 'EBF_NETZ', label: 'eBF Netz' },
    { value: 'EBF_WIN', label: 'eBF Win' },
    { value: 'EBF_ZOS', label: 'eBF zOS' },
    { value: 'IKT_ENTWICKLER_PF', label: 'IKT Entwickler PF' },
    { value: 'SERVICE_MANAGER', label: 'Service Manager' },
    { value: 'ARCHITEKTUR', label: 'Architektur' },
    { value: 'ASSISTENZ', label: 'Assistenz' },
    { value: 'JOBVERARBEITUNG', label: 'Jobverarbeitung' },
    { value: 'BACKUP_RECOVERY', label: 'Backup & Recovery' },
    { value: 'JIRA_SERVICES', label: 'Jira Services' },
    { value: 'TECHN_INITIATIVEN', label: 'techn. Initiativen' },
    { value: 'EBF_PORTAL', label: 'eBF Portal' },
    { value: 'PROJEKTUNTERSTUETZUNG', label: 'Projektunterstützung' },
    { value: 'TESTMANAGEMENT', label: 'Testmanagement' }
  ];



  POSITION_TYPEN.sort((a, b) =>
    a.label.localeCompare(b.label, 'de', { sensitivity: 'base' })
  );

  PRODUKT_TYPEN.sort((a, b) =>
    a.label.localeCompare(b.label, 'de', { sensitivity: 'base' })
  );

  GESCHLECHT_TYPEN.sort((a, b) =>
    a.label.localeCompare(b.label, 'de', { sensitivity: 'base' })
  );

  MITARBEITER_TYPEN.sort((a, b) =>
    a.label.localeCompare(b.label, 'de', { sensitivity: 'base' })
  );

  GETITROLLE_TYPEN.sort((a, b) =>
    a.label.localeCompare(b.label, 'de', { sensitivity: 'base' })
  );
  BUCHER_TYPEN.sort((a, b) =>
    a.label.localeCompare(b.label, 'de', { sensitivity: 'base' })
  );

  DIENSTVERWENDUNG_TYPEN.sort((a, b) =>
    a.label.localeCompare(b.label, 'de', { sensitivity: 'base' })
  );

  FREIGABEGRUPPE_TYPEN.sort((a, b) =>
    a.label.localeCompare(b.label, 'de', { sensitivity: 'base' })
  );

  RECHT_TYPEN.sort((a, b) =>
    a.label.localeCompare(b.label, 'de', { sensitivity: 'base' })
  );





