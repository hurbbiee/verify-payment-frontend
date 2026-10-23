import { API_BASE_URL } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';

export interface HealthResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  usage() {
    return this.http
      .get<{ success: boolean; data: { used: number; max: number | null } }>(
        `${API_BASE_URL}/api/usage`,
      )
      .pipe(timeout(12000));
  }
  private readonly http = inject(HttpClient);

  check(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${API_BASE_URL}/api/health`).pipe(timeout(5000));
  }
}
