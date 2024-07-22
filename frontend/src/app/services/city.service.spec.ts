import { TestBed } from '@angular/core/testing';

import { CityService } from './city.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('CityService', () => {
  let service: CityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ CityService ]
    });
    service = TestBed.inject(CityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected cities when searchCities is called', () => {
    // Arrange
    const mockCities = ['New York', 'Los Angeles'];
    const query = 'New';

    // Act
    service.searchCities(query).subscribe(cities => {
      expect(cities).toEqual(mockCities);
    });
    const req = httpMock.expectOne(`${service.apiUrlForMock}?q=${query}`);

    // Assert
    expect(req.request.method).toBe('GET');
    req.flush(mockCities);
  });

  it('should return distinct city names when a valid query is provided', () => {
    // Arrange
    const mockCities = ['Liverpool', 'Liverpool'];
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const cityService = new CityService(httpClientSpy);
    // Mock the HTTP response to return the array with duplicates
    httpClientSpy.get.and.returnValue(of(mockCities));

    // Act
    cityService.searchCities('Liverpool').subscribe(cities => {
      // Expect the result to be ['Liverpool'], since duplicates are filtered out
      expect(cities).toEqual(['Liverpool']);
    });

    // Verify that the HTTP request was made exactly once
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('should return "No results found" when an empty query is provided', () => {
    // Arrange
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const cityService = new CityService(httpClientSpy);
    // Mock the HTTP response to return an empty array
    httpClientSpy.get.and.returnValue(of([]));

    // Act
    cityService.searchCities('new taipei').subscribe(cities => {
      // Expect the result to be ['No results found']
      expect(cities).toEqual(['No results found']);
    });

    // Verify that the HTTP request was made exactly once
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });
});
