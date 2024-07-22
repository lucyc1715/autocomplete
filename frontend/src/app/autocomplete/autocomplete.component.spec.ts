import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { AutocompleteComponent } from './autocomplete.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CityService } from '../services/city.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;
  let cityService: CityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AutocompleteComponent, ReactiveFormsModule],
      providers: [ CityService, provideHttpClient() ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    cityService = TestBed.inject(CityService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a city when a city element is clicked', () => {
    // Arrange
    const cities = ['New York', 'Los Angeles', 'Chicago'];
    spyOn(cityService, 'searchCities').and.returnValue(of(cities));
    component.searchControl.setValue('New');

    // Act
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // data
      const cityElements = fixture.debugElement.queryAll(By.css('[data-test="city"]'));
      cityElements[0].triggerEventHandler('click', null);

      // Assert
      expect(component.onSelectCity).toEqual(cities[0]);
    });
  });

  it('should clear search input when clearSearch method is called', () => {
    component.searchControl.setValue('New York');
    component.clearSearch();
    expect(component.searchControl.value).toEqual('');
  });

  it('should display the list of cities returned by the cityService', () => {
    // Arrange
    const cities = ['New York', 'Los Angeles', 'Chicago'];
    spyOn(cityService, 'searchCities').and.returnValue(of(cities));
    component.searchControl.setValue('New');

    // Act
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const cityElements = fixture.debugElement.nativeElement.querySelector('[data-test="city"]');

      // Assert
      expect(cityElements.length).toBe(cities.length);
      expect(cityElements[0].nativeElement.textContent).toContain(cities[0]);
      expect(cityElements[1].nativeElement.textContent).toContain(cities[1]);
      expect(cityElements[2].nativeElement.textContent).toContain(cities[2]);
    });
  });

  it('should not display cities if none are returned by the cityService', () => {
    // Arrange
    const cities: any[] = [];
    spyOn(cityService, 'searchCities').and.returnValue(of(cities));
    component.searchControl.setValue('New');

    // Act
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const cityElements = fixture.debugElement.nativeElement.querySelector('[data-test="city"]');

      // Assert
      expect(cityElements).toBeNull();
    });
  });
});
