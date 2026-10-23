import { Component, DestroyRef, inject, isDevMode, signal } from '@angular/core';
import { SlipResponse } from '../../core/service/slip.model';
import { SlipResult } from './components/slip-result/slip-result';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { InputUpload } from './components/input-upload/input-upload';
import { QrResponse, SlipService } from '../../core/service/slip.service';
import { HealthService } from '../../core/service/health.service';

@Component({
  selector: 'app-upload-slip',
  imports: [InputUpload, SlipResult],
  templateUrl: './upload-slip.html',
  styleUrl: './upload-slip.scss',
})
export class UploadSlip {
  private readonly health = inject(HealthService);
  readonly connection = signal<'checking' | 'ready' | 'offline'>('checking');
  readonly usage = signal<{ used: number; max: number | null } | null>(null);
  readonly usageState = signal('กำลังโหลดจำนวนใช้งาน...');

  refreshUsage(): void {
    this.health.usage().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: response => { this.usage.set(response.data); this.usageState.set(''); },
      error: () => { this.usage.set(null); this.usageState.set('ดึงจำนวนใช้งานไม่ได้'); },
    });
  }
  private readonly service = inject(SlipService);
  private readonly destroyRef = inject(DestroyRef);
  readonly file = signal<File | null>(null);
  readonly preview = signal<string | null>(null);
  readonly loading = signal(false);
  readonly message = signal('');
  readonly failed = signal(false);
  readonly demoMode = signal(false);
  readonly result = signal<SlipResponse | null>(null);
  readonly showDemoResult = signal(false);
  readonly qrResult = signal<QrResponse | null>(null);

  setDemoMode(enabled: boolean): void {
    if (this.loading()) return;
    this.demoMode.set(enabled && isDevMode());
    this.showDemoResult.set(false);
    this.result.set(null);
    this.qrResult.set(null);
    this.message.set('');
  }

  constructor() {
    this.destroyRef.onDestroy(() => this.releasePreview());
    this.health.check().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: response => this.connection.set(response.success ? 'ready' : 'offline'),
      error: () => this.connection.set('offline'),
    });
    this.refreshUsage();
  }

  select(file: File | null): void {
    if (this.loading()) return;
    this.releasePreview();
    this.failed.set(false);
    this.file.set(file);
    this.preview.set(file ? URL.createObjectURL(file) : null);
    this.message.set('');
    this.showDemoResult.set(false);
    this.result.set(null);
    this.qrResult.set(null);
  }

  submit(): void {
    const file = this.file();
    if (!file || this.loading()) return;
    if (this.demoMode()) {
      this.showDemoResult.set(true);
      this.message.set('');
      return;
    }
    this.loading.set(true);
    this.message.set('');
    this.failed.set(false);
    this.service.upload(file).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (response) => { this.result.set(response); this.refreshUsage(); },
      error: (error: unknown) => {
        this.refreshUsage();
        this.failed.set(true);
        const status = error instanceof HttpErrorResponse ? error.status : null;
        this.message.set(error instanceof HttpErrorResponse && error.error?.error?.code === 'VERIFICATION_NOT_CONFIGURED'
          ? 'กรุณาตั้ง THUNDER_API_KEY ใน backend/.env แล้ว restart backend'
          : error instanceof HttpErrorResponse && error.error?.error?.message ? error.error.error.message
          : status === 404 ? 'Backend ยังไม่มี API ตรวจสลิป (/api/slips/verify)'
          : status === 0 ? 'เชื่อมต่อ API ไม่ได้ กรุณาตรวจสอบ backend และการเชื่อมต่อ'
          : status === 413 ? 'ไฟล์มีขนาดเกินที่เซิร์ฟเวอร์อนุญาต'
          : status === 429 ? 'ส่งคำขอบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'
          : 'อัปโหลดไม่สำเร็จหรือหมดเวลารอ กรุณาลองอีกครั้ง');
      },
    });
  }

  private releasePreview(): void {
    const url = this.preview();
    if (url) URL.revokeObjectURL(url);
  }
}
