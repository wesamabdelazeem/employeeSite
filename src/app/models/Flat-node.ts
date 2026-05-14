import { expand } from "rxjs";
import { ApiTaetigkeitsbuchung } from './ApiTaetigkeitsbuchung';

export interface FlatNode {
  expandable: boolean;
  name: string|undefined;
  level: number;
  hasNotification?: boolean;
  formData?:any;
  stempelzeitData?: any;
  buchungData?: ApiTaetigkeitsbuchung;
  monthName?: string;
  gebuchtTotal?: string;
  dayName?: string;
  gestempelt?: string;
  gebucht?: string;
  stempelzeitenList?: string[];
  productName?: string;
  positionName?: string;
  gebuchtTime?: string;
  gestempeltTime?: string;
  timeRange?: string;
  hasAlarm?: boolean;
  alarmData?: any;
  hasEntries?: boolean;
  buchungspunkt?: string;
    dateKey?: string;
  monthKey?: string;
zeitTyp?: string;
isNachverrechnung?: boolean;
taetigkeit?: string;
anmerkung?: string;
jiraTicket?: string;
}

