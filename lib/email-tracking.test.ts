import { describe, it, expect } from 'vitest';
import { computeEventUpdate, type TrackedRowSnapshot, type ResendWebhookEvent } from './email-tracking';

const EVENT_AT = '2026-08-19T16:00:00.000Z';

function row(overrides: Partial<TrackedRowSnapshot> = {}): TrackedRowSnapshot {
  return { status: 'scheduled', open_count: 0, click_count: 0, opened_at: null, clicked_at: null, ...overrides };
}

function event(type: string, data: ResendWebhookEvent['data'] = {}): ResendWebhookEvent {
  return { type, data };
}

describe('computeEventUpdate', () => {
  it('email.sent moves a scheduled row to sent', () => {
    const update = computeEventUpdate(row({ status: 'scheduled' }), event('email.sent'), EVENT_AT);
    expect(update.status).toBe('sent');
    expect(update.last_event_type).toBe('email.sent');
    expect(update.last_event_at).toBe(EVENT_AT);
  });

  it('email.delivered sets delivered_at and status', () => {
    const update = computeEventUpdate(row({ status: 'sent' }), event('email.delivered'), EVENT_AT);
    expect(update.status).toBe('delivered');
    expect(update.delivered_at).toBe(EVENT_AT);
  });

  it('email.delivered_delayed only records the event, no status change', () => {
    const update = computeEventUpdate(row({ status: 'sent' }), event('email.delivered_delayed'), EVENT_AT);
    expect(update.status).toBeUndefined();
    expect(update.last_event_type).toBe('email.delivered_delayed');
  });

  it('email.bounced records the reason and sets status', () => {
    const update = computeEventUpdate(
      row({ status: 'sent' }),
      event('email.bounced', { bounce: { message: 'mailbox unavailable' } }),
      EVENT_AT
    );
    expect(update.status).toBe('bounced');
    expect(update.bounced_at).toBe(EVENT_AT);
    expect(update.bounce_reason).toBe('mailbox unavailable');
  });

  it('email.bounced without a bounce object still sets status, reason is null', () => {
    const update = computeEventUpdate(row({ status: 'sent' }), event('email.bounced'), EVENT_AT);
    expect(update.status).toBe('bounced');
    expect(update.bounce_reason).toBeNull();
  });

  it('email.complained sets complained_at and status', () => {
    const update = computeEventUpdate(row({ status: 'delivered' }), event('email.complained'), EVENT_AT);
    expect(update.status).toBe('complained');
    expect(update.complained_at).toBe(EVENT_AT);
  });

  it('first email.opened sets opened_at and bumps open_count to 1', () => {
    const update = computeEventUpdate(row({ open_count: 0, opened_at: null }), event('email.opened'), EVENT_AT);
    expect(update.open_count).toBe(1);
    expect(update.opened_at).toBe(EVENT_AT);
    expect(update.status).toBeUndefined();
  });

  it('subsequent email.opened bumps the count but keeps the original opened_at', () => {
    const earlier = '2026-08-18T09:00:00.000Z';
    const update = computeEventUpdate(row({ open_count: 1, opened_at: earlier }), event('email.opened'), EVENT_AT);
    expect(update.open_count).toBe(2);
    expect(update.opened_at).toBeUndefined(); // not overwritten
  });

  it('email.clicked behaves the same way as email.opened, on its own fields', () => {
    const update = computeEventUpdate(row({ click_count: 0, clicked_at: null }), event('email.clicked'), EVENT_AT);
    expect(update.click_count).toBe(1);
    expect(update.clicked_at).toBe(EVENT_AT);
  });

  it('an unrecognized event type only records last_event_type/last_event_at', () => {
    const update = computeEventUpdate(row(), event('email.some_future_event'), EVENT_AT);
    expect(Object.keys(update).sort()).toEqual(['last_event_at', 'last_event_type']);
  });

  describe('status rank guarding', () => {
    it('does not let a late "sent" regress an already-bounced row', () => {
      const update = computeEventUpdate(row({ status: 'bounced' }), event('email.sent'), EVENT_AT);
      expect(update.status).toBeUndefined();
    });

    it('does not let a late "delivered" regress an already-complained row', () => {
      const update = computeEventUpdate(row({ status: 'complained' }), event('email.delivered'), EVENT_AT);
      expect(update.status).toBeUndefined();
    });

    it('allows forward progression from sent to delivered', () => {
      const update = computeEventUpdate(row({ status: 'sent' }), event('email.delivered'), EVENT_AT);
      expect(update.status).toBe('delivered');
    });

    it('allows a same-rank transition (bounced -> complained)', () => {
      const update = computeEventUpdate(row({ status: 'bounced' }), event('email.complained'), EVENT_AT);
      expect(update.status).toBe('complained');
    });
  });
});
