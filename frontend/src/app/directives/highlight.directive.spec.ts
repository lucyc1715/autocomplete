import { HighlightDirective } from './highlight.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div [appHighlight]="mainString" [highlight]="highlight"></div>
  `
})
class TestComponent {
  mainString = 'llparisive';
  highlight = 'paris';
}

describe('HighlightDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [HighlightDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(HighlightDirective));
    element = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should highlight the specified text', () => {
    const highlightedText = element.querySelector('[data-test="highlight"]');
    expect(highlightedText).toBeTruthy();
    expect(highlightedText?.textContent).toContain(component.highlight);
  });

  it('should not highlight when the mainString does not contain the highlight text', () => {
    component.highlight = 'nonexistent';
    fixture.detectChanges();
    const highlightedText = element.querySelector('[data-test="highlight"]');
    expect(highlightedText).not.toContain(component.highlight);
  });

  it('should update the highlight when the mainString changes', () => {
    // Arrange
    component.mainString = 'parisive';
    fixture.detectChanges();

    // Act
    const highlightedText = element.querySelector('[data-test="highlight"]');

    // Assert
    expect(highlightedText?.textContent).toContain(component.highlight);
  });

  it('should update the highlight when the highlight text changes', async () => {
    // Arrange
    component.highlight = 'par';
    fixture.detectChanges();
    await fixture.whenStable(); // Wait for asynchronous tasks to complete

    // Act
    const highlightedText = fixture.nativeElement.querySelector('[data-test="highlight"]');

    // Assert
    expect(highlightedText).toBeTruthy(); // Ensure the element exists
    expect(highlightedText?.textContent).toContain(component.highlight);
  });

  it('should not highlight when mainString is empty', () => {
    // Arrange
    component.mainString = '';
    component.highlight = 'highlight';
    fixture.detectChanges();

    // Act
    const highlightedText = element.querySelector('[data-test="highlight"]');

    // Assert
    expect(highlightedText).not.toContain(component.highlight);
  });
});
