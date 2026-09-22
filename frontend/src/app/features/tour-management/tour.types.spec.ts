import { describe, it, expect } from 'vitest';
import {
  getDangerLevelName,
  formatRequirements,
  formatShortRequirements,
  formatCost,
  getTodayDateString,
  isTourUpcoming,
} from './tour.types';

describe('Tour Types & Utilities', () => {
  describe('getDangerLevelName', () => {
    it('should return correct German name for valid danger levels (1-5)', () => {
      expect(getDangerLevelName(1)).toBe('Gering');
      expect(getDangerLevelName(2)).toBe('Mässig');
      expect(getDangerLevelName(3)).toBe('Erheblich');
      expect(getDangerLevelName(4)).toBe('Gross');
      expect(getDangerLevelName(5)).toBe('Sehr gross');
    });

    it('should return empty string for invalid, negative, or undefined danger levels', () => {
      expect(getDangerLevelName(undefined)).toBe('');
      expect(getDangerLevelName(0)).toBe('');
      expect(getDangerLevelName(6)).toBe('');
      expect(getDangerLevelName(-1)).toBe('');
    });
  });

  describe('formatRequirements & formatShortRequirements', () => {
    it('should return detailed description for levels A, B, C, D', () => {
      expect(formatRequirements('A')).toContain('wenig anstrengend');
      expect(formatRequirements('B')).toContain('ziemlich anstrengend');
      expect(formatRequirements('C')).toContain('anstrengend (6 - 10 h');
      expect(formatRequirements('D')).toContain('sehr anstrengend');
    });

    it('should return short description for levels A, B, C, D', () => {
      expect(formatShortRequirements('A')).toBe('A (wenig anstrengend, bis 800 HM)');
      expect(formatShortRequirements('B')).toBe('B (ziemlich anstrengend, 800-1300 HM)');
      expect(formatShortRequirements('C')).toBe('C (anstrengend, 1300-1600 HM)');
      expect(formatShortRequirements('D')).toBe('D (sehr anstrengend, > 1600 HM)');
    });

    it('should return empty string when level is undefined or null', () => {
      expect(formatRequirements(undefined)).toBe('');
      expect(formatShortRequirements(undefined)).toBe('');
    });

    it('should return original string when level is unknown', () => {
      expect(formatRequirements('Custom')).toBe('Custom');
      expect(formatShortRequirements('Custom')).toBe('Custom');
    });
  });

  describe('formatCost', () => {
    it('should return Gratis for 0, "0", and case-insensitive "gratis"', () => {
      expect(formatCost(0)).toBe('Gratis');
      expect(formatCost('0')).toBe('Gratis');
      expect(formatCost('gratis')).toBe('Gratis');
      expect(formatCost('GRATIS')).toBe('Gratis');
    });

    it('should format numeric values as CHF <amount>.-', () => {
      expect(formatCost(25)).toBe('CHF 25.-');
      expect(formatCost('50')).toBe('CHF 50.-');
      expect(formatCost(120.5)).toBe('CHF 120.5.-');
    });

    it('should return empty string for null, undefined, or empty string', () => {
      expect(formatCost(null)).toBe('');
      expect(formatCost(undefined)).toBe('');
      expect(formatCost('')).toBe('');
    });

    it('should return raw text for non-numeric descriptions', () => {
      expect(formatCost('Spende')).toBe('Spende');
    });
  });

  describe('getTodayDateString', () => {
    it('should return date in YYYY-MM-DD format with zero padding', () => {
      const today = getTodayDateString();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('isTourUpcoming', () => {
    const fixedToday = '2026-09-22';

    it('should return true if tour date is today', () => {
      expect(isTourUpcoming('2026-09-22', fixedToday)).toBe(true);
    });

    it('should return true if tour date is in the future', () => {
      expect(isTourUpcoming('2026-09-23', fixedToday)).toBe(true);
      expect(isTourUpcoming('2027-01-01', fixedToday)).toBe(true);
    });

    it('should return false if tour date is in the past', () => {
      expect(isTourUpcoming('2026-09-21', fixedToday)).toBe(false);
      expect(isTourUpcoming('2025-12-31', fixedToday)).toBe(false);
    });

    it('should correctly handle ISO timestamps with time component', () => {
      expect(isTourUpcoming('2026-09-22T14:30:00.000Z', fixedToday)).toBe(true);
      expect(isTourUpcoming('2026-09-21T23:59:59.000Z', fixedToday)).toBe(false);
    });

    it('should return false for empty or undefined dates', () => {
      expect(isTourUpcoming(undefined, fixedToday)).toBe(false);
      expect(isTourUpcoming('', fixedToday)).toBe(false);
      expect(isTourUpcoming('   ', fixedToday)).toBe(false);
    });
  });
});
