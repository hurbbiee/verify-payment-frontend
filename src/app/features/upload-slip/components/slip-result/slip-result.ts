import { Component, input } from '@angular/core';
import { SlipResponse } from '../../../../core/service/slip.model';
@Component({
  selector: 'app-slip-result',
  templateUrl: './slip-result.html',
  styleUrl: './slip-result.scss',
})
export class SlipResult {
  readonly result = input<SlipResponse | null>(null);

  formatAmount(amount: number | null, currency: string | null): string {
    if (amount === null) return 'ไม่มีข้อมูล';
    const formatted = new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(amount);
    if (currency === '764' || currency === 'THB') return `${formatted} THB`;
    return currency ? `${formatted} ${currency}` : `${formatted} (ไม่ระบุสกุลเงิน)`;
  }

}
