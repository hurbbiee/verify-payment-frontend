import { API_BASE_URL } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { timeout } from 'rxjs';
import { SlipResponse } from './slip.model';

@Injectable({ providedIn: 'root' })
export class SlipService {
  readQr(file: File) {
    const body = new FormData();
    body.append('slip', file);
    return this.http
      .post<QrResponse>(`${API_BASE_URL}/api/slips/read-qr`, body)
      .pipe(timeout(30000));
  }
  private readonly http = inject(HttpClient);
  upload(file: File) {
    const body = new FormData();
    body.append('slip', file);
    return this.http
      .post<SlipResponse>(`${API_BASE_URL}/api/slips/verify`, body)
      .pipe(timeout(30000));
  }
}
export interface QrResponse {
  success: boolean;
  status: 'READ_ONLY';
  verified: false;
  data: {
    payload: string;
    byteLength: number;
    decoded?: {
      apiId: string;
      sendingBankCode: string;
      transactionRef: string;
      countryCode: string;
      note: string;
      checksum: { provided: string; calculated: string; valid: boolean } | null;
    } | null;
    inspection?: {
      format: string;
      note: string;
      fields: { id: string; length: number; value: string }[];
    };
  };
  message: string;
}
