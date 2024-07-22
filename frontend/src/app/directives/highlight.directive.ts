import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  @Input('appHighlight')
  mainString!: string;

  @Input('highlight')
  highlight!: string;

  constructor(private el: ElementRef) { }

  /**
   * Detect changes in the mainString and highlight input
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainString'] || changes['highlight']) {
      this.highlightText();
    }
  }

  /**
   * Highlight the text
   */
  private highlightText(): void {
    if (this.mainString && this.highlight) {
      const regex = new RegExp(this.highlight, 'gi');

      // replace the mainString with the highlighted text
      const highlighted = this.mainString.replace(regex, `<span data-test='highlight' style="font-weight: bold;">$&</span>`);
      this.el.nativeElement.innerHTML = highlighted;
    }
  }
}
