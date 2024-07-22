import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  public apiUrlForMock: string = 'http://localhost:3000/cities';
  private apiUrl: string = 'http://localhost:3000/cities';

  constructor(private http: HttpClient) { }

  /**
   * Search cities based on the query string
   * @param query
   * @returns 
   */
  searchCities(query: string): Observable<string[]> {
    if (!query.trim()) {
      return of([]); // Return an empty array if the query is empty
    }
    return this.http.get<string[]>(`${this.apiUrl}?q=${query}`).pipe(
      map((cities: string[]) => {
        const distinctCities = [...new Set(cities)];
        return distinctCities.length ? distinctCities : ['No results found'];
      }),
      catchError(() => of(['No results found'])),
    );
  }
}
