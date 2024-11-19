import type { WordPressSite } from './index';

export interface ScheduleRule {
  id: string;
  name: string;
  condition: {
    type: 'time' | 'engagement' | 'traffic' | 'custom';
    operator: 'equals' | 'greater' | 'less' | 'between' | 'not';
    value: any;
    secondaryValue?: any;
  };
  action: {
    type: 'adjust_frequency' | 'change_persona' | 'pause' | 'resume';
    value: any;
  };
  priority: number;
  enabled: boolean;
}

export interface TimeZoneConfig {
  timeZone: string;
  adjustForDST: boolean;
  businessHours: {
    start: string;
    end: string;
    daysOfWeek: number[];
  };
  holidays: string[]; // Dates ISO
  blackoutPeriods: Array<{
    start: string;
    end: string;
    reason: string;
  }>;
}

export interface ScheduleStats {
  totalComments: number;
  averagePerDay: number;
  peakHours: Array<{
    hour: number;
    count: number;
  }>;
  engagementRates: Array<{
    hour: number;
    rate: number;
  }>;
}