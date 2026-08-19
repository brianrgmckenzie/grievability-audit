import { describe, it, expect } from 'vitest';
import { computeSendAt } from './schedule-sequence';

describe('computeSendAt', () => {
  it('adds dayOffset days and pins the time to 16:00 UTC in normal mode', () => {
    const baseline = new Date('2026-01-01T10:00:00.000Z');
    expect(computeSendAt(1, baseline, false).toISOString()).toBe('2026-01-02T16:00:00.000Z');
    expect(computeSendAt(4, baseline, false).toISOString()).toBe('2026-01-05T16:00:00.000Z');
    expect(computeSendAt(21, baseline, false).toISOString()).toBe('2026-01-22T16:00:00.000Z');
  });

  it('rolls over month/year boundaries correctly', () => {
    const baseline = new Date('2026-12-30T10:00:00.000Z');
    expect(computeSendAt(4, baseline, false).toISOString()).toBe('2027-01-03T16:00:00.000Z');
  });

  it('uses minutes instead of days in fast mode, same relative spacing', () => {
    const baseline = new Date('2026-01-01T10:00:00.000Z');
    expect(computeSendAt(1, baseline, true).toISOString()).toBe('2026-01-01T10:01:00.000Z');
    expect(computeSendAt(21, baseline, true).toISOString()).toBe('2026-01-01T10:21:00.000Z');
  });
});
