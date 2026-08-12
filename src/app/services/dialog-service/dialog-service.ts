import { Injectable, signal } from '@angular/core';

export type DialogType = 'confirm' | 'info' | 'input' | 'emoji' | 'achievement' | 'add-recipe-tag' | 'add-port' | 'add-sailboat' | 'add-sailboat-photo' | 'create-sports-prediction-league' | 'tag-selector';

export interface DialogConfig {
  type: DialogType;
  title: string;
  text?: string;
  icon?: string;
  subtitle?: string;
  emoji?: string;
  seconds?: number;
  confirmLabel?: string;
  cancelLabel?: string;
  value?: any;
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

  openEmojiPickerDialog<T = any>(config: Omit<DialogConfig, 'type'>): Promise<DialogResult<T>> {
    return this.open({ ...config, type: 'emoji' });
  }

  openAchievementDialog<T = any>(config: Omit<DialogConfig, 'type'>): Promise<DialogResult<T>> {
    return this.open({ ...config, type: 'achievement' });
  }

  openAddRecipeTagDialog<T = any>(config: Omit<DialogConfig, 'type'>): Promise<DialogResult<T>> {
    return this.open({ ...config, type: 'add-recipe-tag' });
  }

  openAddPortDialog<T = any>(config: Omit<DialogConfig, 'type'>): Promise<DialogResult<T>> {
    return this.open({ ...config, type: 'add-port' });
  }

  openAddSailboatDialog<T = any>(config: Omit<DialogConfig, 'type'>): Promise<DialogResult<T>> {
    return this.open({ ...config, type: 'add-sailboat' });
  }

  openAddSailboatPhotoDialog<T = any>(config: Omit<DialogConfig, 'type'>): Promise<DialogResult<T>> {
    return this.open({ ...config, type: 'add-sailboat-photo' });
  }

  openCreateSportsPredictionLeagueDialog<T = any>(config: Omit<DialogConfig, 'type'>): Promise<DialogResult<T>> {
    return this.open({ ...config, type: 'create-sports-prediction-league' });
  }

  openTagSelectorDialog<T = any>(config: Omit<DialogConfig, 'type'>): Promise<DialogResult<T>> {
    return this.open({ ...config, type: 'tag-selector' });
  }

  close(confirmed: boolean, value?: any) {
    this.activeConfig.set(null);
    this.resolveDialog?.({ confirmed, value });
  }

  get config() {
    return this.activeConfig.asReadonly();
  }
}