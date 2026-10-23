import { SlipResult } from './slip-result';
import { TestBed } from '@angular/core/testing';

describe('SlipResult amount', () => {
  it('formats numeric Thai currency without treating it as part of the amount', () => {
    const component = TestBed.createComponent(SlipResult).componentInstance;
    expect(component.formatAmount(50, '764')).toBe('50.00 THB');
    expect(component.formatAmount(0, 'THB')).toBe('0.00 THB');
    expect(component.formatAmount(null, '764')).toBe('ไม่มีข้อมูล');
    expect(component.formatAmount(50, null)).toBe('50.00 (ไม่ระบุสกุลเงิน)');
  });
});
