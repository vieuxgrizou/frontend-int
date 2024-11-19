import { describe, it, expect, vi } from 'vitest';
import { calculateNextCommentTime, validateScheduleRules } from '../scheduling';
import type { ScheduleRule, TimeZoneConfig } from '../../types/scheduling';

describe('Comment Scheduling', () => {
  const mockTimeZoneConfig: TimeZoneConfig = {
    timeZone: 'Europe/Paris',
    adjustForDST: true,
    businessHours: {
      start: '09:00',
      end: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    },
    holidays: [],
    blackoutPeriods: []
  };

  const mockRule: ScheduleRule = {
    id: '1',
    name: 'Business Hours',
    condition: {
      type: 'time',
      operator: 'between',
      value: '09:00',
      secondaryValue: '17:00'
    },
    action: {
      type: 'adjust_frequency',
      value: 1.5
    },
    priority: 1,
    enabled: true
  };

  it('calculates next comment time within business hours', () => {
    const now = new Date('2024-03-18T08:00:00Z'); // Lundi 8h UTC
    const nextTime = calculateNextCommentTime(now, mockTimeZoneConfig);

    expect(nextTime.getHours()).toBeGreaterThanOrEqual(9);
    expect(nextTime.getHours()).toBeLessThan(17);
  });

  it('validates schedule rules', () => {
    const rules = [mockRule];
    const errors = validateScheduleRules(rules);
    expect(errors).toHaveLength(0);
  });

  it('respects blackout periods', () => {
    const configWithBlackout = {
      ...mockTimeZoneConfig,
      blackoutPeriods: [{
        start: '2024-03-18T10:00:00Z',
        end: '2024-03-18T12:00:00Z',
        reason: 'Maintenance'
      }]
    };

    const now = new Date('2024-03-18T10:30:00Z');
    const nextTime = calculateNextCommentTime(now, configWithBlackout);

    expect(nextTime.getTime()).toBeGreaterThan(new Date('2024-03-18T12:00:00Z').getTime());
  });
});