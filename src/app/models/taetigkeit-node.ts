import { ApiTaetigkeitsbuchung } from './ApiTaetigkeitsbuchung';

export interface TaetigkeitNode {
    alarmData?: null;
    hasAlarm?: boolean;
    monthName?: string | undefined;
    gebuchtTotal?: string | undefined;
    dayName?: string | undefined;
    gestempelt?: string | undefined;
    gebucht?: string | undefined;
    productName?: string | undefined;
    positionName?: string | undefined;
    gebuchtTime?: string | undefined;
    gestempeltTime?: string | undefined;
    timeRange?: string | undefined;
    name?: string;
    children?: TaetigkeitNode[];
    hasNotification?: boolean;
    formData?: any;
    stempelzeitData?: any;
    buchungData?: ApiTaetigkeitsbuchung;
    stempelzeitenList?: string[];
    hasEntries?: boolean;
    buchungspunkt?: string;
    dateKey?: string;
    monthKey?: string;
    isNachverrechnung?: boolean;
    taetigkeit?: string;
    anmerkung?: string;
    jiraTicket?: string;
  }