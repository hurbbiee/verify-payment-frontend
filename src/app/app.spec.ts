import { API_BASE_URL } from './core/config/api.config';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { UploadSlip } from './features/upload-slip/upload-slip';
import { InputUpload } from './features/upload-slip/components/input-upload/input-upload';

describe('Upload slip', () => {
  it('shows demo only after clicking and clears it when removing the image', () => {
    const fixture = TestBed.createComponent(UploadSlip);
    const page = fixture.componentInstance;
    page.file.set(new File(['image'], 'slip.png', { type: 'image/png' }));
    expect(page.showDemoResult()).toBe(false);
    page.setDemoMode(true);
    page.submit();
    expect(page.showDemoResult()).toBe(true);
    TestBed.inject(HttpTestingController).expectNone(`${API_BASE_URL}/api/slips/verify`);
    page.select(null);
    expect(page.showDemoResult()).toBe(false);
  });
  beforeEach(() => TestBed.configureTestingModule({
    imports: [UploadSlip, InputUpload],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  }));

  it('emits an image without sending an HTTP request', () => {
    const fixture = TestBed.createComponent(InputUpload);
    const file = new File(['image'], 'slip.png', { type: 'image/png' });
    let emitted: File | null = null;
    fixture.componentInstance.fileSelected.subscribe(value => emitted = value);
    fixture.componentInstance.select({ target: { files: [file], value: '' } } as unknown as Event);
    expect(emitted).toBe(file);
    TestBed.inject(HttpTestingController).expectNone(`${API_BASE_URL}/api/slips/verify`);
  });

  it('rejects unsupported and oversized files', () => {
    const fixture = TestBed.createComponent(InputUpload);
    for (const file of [new File(['x'], 'x.txt', { type: 'text/plain' }), new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'big.png', { type: 'image/png' })]) {
      fixture.componentInstance.select({ target: { files: [file], value: '' } } as unknown as Event);
      expect(fixture.componentInstance.error()).not.toBe('');
    }
  });

  it('uploads only on submit and prevents repeated requests while loading', () => {
    const fixture = TestBed.createComponent(UploadSlip);
    const page = fixture.componentInstance;
    page.setDemoMode(false);
    // Avoid depending on object URL support in the test browser.
    const file = new File(['image'], 'slip.png', { type: 'image/png' });
    page.file.set(file);
    const http = TestBed.inject(HttpTestingController);
    http.expectNone(`${API_BASE_URL}/api/slips/verify`);
    page.submit();
    page.submit();
    const req = http.expectOne(`${API_BASE_URL}/api/slips/verify`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.get('slip')).toBe(file);
    expect(req.request.headers.has('Content-Type')).toBe(false);
    expect(page.loading()).toBe(true);
    req.flush({}, { status: 404, statusText: 'Not Found' });
    expect(page.loading()).toBe(false);
    expect(page.message()).toContain('Backend ยังไม่มี API');
    page.select(null);
    expect(page.file()).toBe(null);
    expect(page.message()).toBe('');
    for (const pending of http.match(request => request.url.endsWith('/health') || request.url.endsWith('/usage'))) {
      pending.flush(pending.request.url.endsWith('/health') ? { success: true } : { success: true, data: { used: 3, max: 100 } });
    }
    http.verify();
  });
});
