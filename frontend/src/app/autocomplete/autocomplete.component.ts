import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { CityService } from '../services/city.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HighlightDirective } from '../directives/highlight.directive';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HighlightDirective],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss'
})
export class AutocompleteComponent {

  searchControl = new FormControl();
  cities$!: Observable<string[]>;

  // Track focused item index
  focusedItem = -1;

  // Array to store the latest list of cities
  citiesList: string[] = [];

  constructor(private cityService: CityService, private sanitizer: DomSanitizer) {

    this.cities$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),  // avoid making too many requests
      distinctUntilChanged(), // only emit when the current value is different from the last
      switchMap(query => this.searchCities(query))  // switch to new observable each time the value changes
    );

    // Subscribe to cities$ observable to update citiesList
    this.cities$.subscribe(cities => {
      this.citiesList = cities;

      // Reset focusedItem when citiesList changes
      this.focusedItem = -1;
    });
  }

  /**
   * Search cities based on the query string
   * invoked CityService's searchCities method
   * @param query
   * @returns
   */
  searchCities(query: string): Observable<string[]> {
    return this.cityService.searchCities(query);
  }

  /**
   * Handle city selection
   * @param city
   */
  onSelectCity(city: string) {
    if (city === 'No results found') {
      this.searchControl.setValue('');
    } else {
      this.searchControl.setValue(city);
    }
  }

  /**
   * Clear search input
   */
  clearSearch() {
    this.searchControl.setValue('');
  }

  /**
   * Handle keyboard events
   * @param event
   */
  onKeyDown(event: KeyboardEvent): void {
    // Check if citiesList is available and not empty
    if (this.citiesList && this.citiesList.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (this.focusedItem < this.citiesList.length - 1) {
          this.focusedItem++;
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (this.focusedItem > 0) {
          this.focusedItem--;
        }
      } else if (event.key === 'Enter' && this.focusedItem !== -1) {
        event.preventDefault();
        const selectedCity = this.citiesList[this.focusedItem];
        this.onSelectCity(selectedCity);
      }
    }
  }

  /**
   * Handle keyboard events for results
   * @param event
   * @param city
   * @param index
   */
  onResultKeyDown(event: KeyboardEvent, city: string, index: number): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (index < this.citiesList.length - 1) {
        this.focusedItem = index + 1;
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index > 0) {
        this.focusedItem = index - 1;
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.onSelectCity(city);
    }
  }
}
