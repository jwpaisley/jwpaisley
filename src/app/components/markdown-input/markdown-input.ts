import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, SecurityContext, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

declare const marked: {
  parse: (input: string, options?: Record<string, unknown>) => string;
  use: (options: Record<string, unknown>) => void;
};

declare const katex: {
  renderToString: (input: string, options?: Record<string, unknown>) => string;
};

const installMarkedMathSupport = (): void => {
  const markedWithMath = marked as Record<string, unknown> & {
    use?: (options: Record<string, unknown>) => void;
  };

  if (typeof marked === 'undefined' || !markedWithMath.use) {
    return;
  }

  const installedFlag = '__jwpaisley_marked_math_installed__';

  if (markedWithMath[installedFlag]) {
    return;
  }

  markedWithMath[installedFlag] = true;

  const blockMath = {
    name: 'blockMath',
    level: 'block',
    start(src: string) {
      return src.match(/\$\$/)?.index ?? -1;
    },
    tokenizer(src: string) {
      const match = src.match(/^\$\$\s*([\s\S]+?)\s*\$\$/);
      if (!match) {
        return undefined;
      }

      return {
        type: 'blockMath',
        raw: match[0],
        text: match[1],
      };
    },
    renderer(token: { text: string }) {
      return katex.renderToString(token.text.trim(), {
        displayMode: true,
        throwOnError: false,
        output: 'html',
      });
    },
  };

  const inlineMath = {
    name: 'inlineMath',
    level: 'inline',
    start(src: string) {
      return src.match(/\$[^$\n]/)?.index ?? -1;
    },
    tokenizer(src: string) {
      const match = src.match(/^(?:^|[^\\])\$([^$\n]+?)\$/);
      if (!match) {
        return undefined;
      }

      const [fullMatch, math] = match;
      const prefixLength = fullMatch.length - math.length - 1;
      const text = fullMatch.slice(prefixLength, -1);

      if (!text) {
        return undefined;
      }

      return {
        type: 'inlineMath',
        raw: fullMatch,
        text,
      };
    },
    renderer(token: { text: string }) {
      return katex.renderToString(token.text.trim(), {
        displayMode: false,
        throwOnError: false,
        output: 'html',
      });
    },
  };

  markedWithMath.use?.({
    extensions: [blockMath, inlineMath],
  });
};

@Component({
  selector: 'jwpaisley-markdown-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './markdown-input.html',
  styleUrl: './markdown-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownInput),
      multi: true,
    },
  ],
})
export class MarkdownInput implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Write markdown here...';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('inputPane') private inputPane?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('previewPane') private previewPane?: ElementRef<HTMLDivElement>;

  renderedHtml = '';
  disabled = false;
  private isSyncingScroll = false;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private readonly sanitizer: DomSanitizer) {
    installMarkedMathSupport();
    this.updatePreview();
  }

  writeValue(value: string | null | undefined): void {
    this.value = value ?? '';
    this.updatePreview();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const nextValue = target.value;

    this.value = nextValue;
    this.updatePreview();
    this.onChange(nextValue);
    this.valueChange.emit(nextValue);
  }

  onPanelScroll(source: 'input' | 'preview'): void {
    if (this.isSyncingScroll) {
      return;
    }

    const sourceElement = source === 'input' ? this.inputPane?.nativeElement : this.previewPane?.nativeElement;
    const targetElement = source === 'input' ? this.previewPane?.nativeElement : this.inputPane?.nativeElement;

    if (!sourceElement || !targetElement) {
      return;
    }

    const sourceMaxScroll = sourceElement.scrollHeight - sourceElement.clientHeight;
    const targetMaxScroll = targetElement.scrollHeight - targetElement.clientHeight;

    if (sourceMaxScroll <= 0 || targetMaxScroll <= 0) {
      return;
    }

    const ratio = sourceElement.scrollTop / sourceMaxScroll;

    this.isSyncingScroll = true;
    targetElement.scrollTop = ratio * targetMaxScroll;
    requestAnimationFrame(() => {
      this.isSyncingScroll = false;
    });
  }

  insertMarkdownImage(url: string, altText = 'blog image'): void {
    const textarea = this.inputPane?.nativeElement as HTMLTextAreaElement | undefined;
    if (!textarea) {
      return;
    }

    const markdownImage = `\n![${altText}](${url})\n`;
    const start = textarea.selectionStart ?? this.value.length;
    const end = textarea.selectionEnd ?? this.value.length;
    const nextValue = `${this.value.slice(0, start)}${markdownImage}${this.value.slice(end)}`;

    this.value = nextValue;
    textarea.value = nextValue;
    this.updatePreview();
    this.onChange(nextValue);
    this.valueChange.emit(nextValue);

    queueMicrotask(() => {
      textarea.focus();
      const caretPosition = start + markdownImage.length;
      textarea.selectionStart = caretPosition;
      textarea.selectionEnd = caretPosition;
    });
  }

  private updatePreview(): void {
    const source = this.value ?? '';
    const parsedHtml = marked.parse(source, {
      gfm: true,
      breaks: true,
    }) as string;

    this.renderedHtml = this.sanitizer.sanitize(SecurityContext.HTML, parsedHtml) ?? '';
  }
}
