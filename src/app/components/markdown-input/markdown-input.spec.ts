import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownInput } from './markdown-input';

describe('MarkdownInput', () => {
  let fixture: ComponentFixture<MarkdownInput>;
  let component: MarkdownInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownInput],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders markdown and LaTeX into the preview panel', () => {
    component.value = '# Hello from markdown\n\n![Example](https://example.com/example.png)\n\n$E = mc^2$';
    fixture.detectChanges();

    expect(component.renderedHtml).toContain('<h1');
    expect(component.renderedHtml).toContain('<img');
    expect(component.renderedHtml).toContain('E = mc^2');
  });
});
