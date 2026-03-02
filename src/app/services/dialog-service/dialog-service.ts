import { Injectable, signal } from '@angular/core';

export type DialogType = 'confirm' | 'info' | 'input';

export interface DialogConfig {
  type: DialogType;
  title: string;
  text?: string;
  icon?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  defaultValue?: string;
}

export interface DialogResult<T = any> {
  confirmed: boolean;
  value?: T;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private resolveDialog?: (value: DialogResult) => void;
  protected activeConfig = signal<DialogConfig | null>(null);

  open<T = any>(config: DialogConfig): Promise<DialogResult<T>> {
    this.activeConfig.set(config);
    
    return new Promise((resolve) => {
      this.resolveDialog = resolve;
    });
  }

  openConfirmDialog<T = any>(config: Omit<DialogConfig, 'type'>): Promise<DialogResult<T>> {
    return this.open({ ...config, type: 'confirm' });
  }

  close(confirmed: boolean, value?: any) {
    this.activeConfig.set(null);
    this.resolveDialog?.({ confirmed, value });
  }

  get config() {
    return this.activeConfig.asReadonly();
  }
}