import { Injectable, signal } from '@angular/core';

export type ToastLevel = 'info' | 'warning' | 'danger' | 'success';

export interface Toast {
  id: number;
  message: string;
  icon: string;
  level: ToastLevel;
}

export const TOAST_DISPLAY_MS = 5000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  public toasts = this.toastsSignal.asReadonly();

  public addToast(message: string, icon: string, level: ToastLevel = 'info') {
    const id = Date.now();
    const newToast: Toast = { id, message, icon, level };

    this.toastsSignal.update(all => [newToast, ...all]);

    setTimeout(() => this.removeToast(id), TOAST_DISPLAY_MS);
  }

  public removeToast(id: number) {
    this.toastsSignal.update(all => all.filter(t => t.id !== id));
  }
}