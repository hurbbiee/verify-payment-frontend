import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-input-upload',
  templateUrl: './input-upload.html',
  styleUrl: './input-upload.scss',
})
export class InputUpload {
  readonly disabled = input(false);
  readonly imageUrl = input<string | null>(null);
  readonly fileName = input('');

  remove(): void {
    if (this.disabled()) return;
    this.error.set('');
    this.fileSelected.emit(null);
  }
  readonly fileSelected = output<File | null>();
  readonly error = signal('');
  readonly dragging = signal(false);

  select(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.accept(input.files?.[0]);
    input.value = '';
  }

  drop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    this.accept(event.dataTransfer?.files[0]);
  }

  dragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.disabled()) this.dragging.set(true);
  }

  private accept(file?: File): void {
    if (this.disabled() || !file) return;
    this.error.set('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.error.set('กรุณาเลือกไฟล์ JPG, PNG หรือ WebP');
      this.fileSelected.emit(null);
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      this.error.set('รูปมีขนาดเกิน 4 MB กรุณาเลือกไฟล์ใหม่');
      this.fileSelected.emit(null);
      return;
    }
    this.fileSelected.emit(file);
  }
}