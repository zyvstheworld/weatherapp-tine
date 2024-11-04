import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private backendUrl: string = 'http://localhost/weatherAppMain/WeatherApi/index.php';

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<any> {
    const url = `${this.backendUrl}/weather/city/${encodeURIComponent(city)}`;
    return this.http.get(url);
  }

  getForecast(city: string): Observable<any> {
    const url = `${this.backendUrl}/forecast/city/${encodeURIComponent(city)}`;
    return this.http.get(url);
  }

  getCurrentWeatherByCoordinates(lat: number, lon: number): Observable<any> {
    const url = `${this.backendUrl}/weather/coordinates/${lat}/${lon}`;
    return this.http.get(url);
  }

  getForecastByCoordinates(lat: number, lon: number): Observable<any> {
    const url = `${this.backendUrl}/forecast/coordinates/${lat}/${lon}`;
    return this.http.get(url);
  }
}
