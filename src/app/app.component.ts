import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './weather.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  city: string = 'Manila';
  weatherData: any = {}; 
  forecastData: any[] = []; 
  loading: boolean = false; 
  error: boolean = false;   
  isCelsius: boolean = true; 

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getWeather(this.city);
    this.getForecast(this.city);
  }

  toggleTemperatureUnit() {
    this.isCelsius = !this.isCelsius;
  }

  getTemperature(): number {
    if (!this.weatherData || !this.weatherData.main) return 0;
    const tempC = this.weatherData.main.temp;
    return this.isCelsius ? tempC : this.celsiusToFahrenheit(tempC);
  }

  celsiusToFahrenheit(tempC: number): number {
    return parseFloat(((tempC * 9) / 5 + 32).toFixed(1));
  }

  getWeatherByLocation(): void {
    if (navigator.geolocation) {
      this.loading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.getWeatherByCoordinates(lat, lon);
          this.getForecastByCoordinates(lat, lon);
        },
        (error) => {
          console.error('Error fetching location:', error);
          this.loading = false;
          this.error = true;
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.error = true;
    }
  }

  getWeatherByCoordinates(lat: number, lon: number): void {
    this.loading = true;
    this.error = false;

    this.weatherService.getCurrentWeatherByCoordinates(lat, lon).subscribe(
      (data) => {
        if (data && data.name) {
          console.log('Current Weather Data:', data);
          this.weatherData = data;
          this.city = data.name; 
        } else {
          console.log('No data found for coordinates.');
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching weather data:', error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  getForecastByCoordinates(lat: number, lon: number): void {
    this.weatherService.getForecastByCoordinates(lat, lon).subscribe(
      (data) => {
        if (data && data.list) {
          console.log('Forecast Data:', data);
          this.forecastData = this.extractNextFiveDaysForecast(data.list);
        } else {
          console.log('No forecast data found for coordinates.');
        }
      },
      (error) => {
        console.error('Error fetching forecast data:', error);
        this.error = true;
      }
    );
  }

  getWeather(city: string): void {
    this.loading = true;
    this.error = false;

    this.weatherService.getCurrentWeather(city).subscribe(
      (data) => {
        if (data && data.main) {
          console.log('Current Weather Data:', data);
          this.weatherData = data;
        } else {
          console.log('No weather data found for city.');
          this.error = true; 
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching weather data:', error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  getForecast(city: string): void {
    this.weatherService.getForecast(city).subscribe(
      (data) => {
        if (data && data.list) {
          console.log('Forecast Data:', data);
          this.forecastData = this.extractNextFiveDaysForecast(data.list);
        } else {
          console.log('No forecast data found for city.');
          this.error = true; 
        }
      },
      (error) => {
        console.error('Error fetching forecast data:', error);
        this.error = true;
      }
    );
  }

  extractNextFiveDaysForecast(forecasts: any[]): any[] {
    const today = new Date();
    const dailyForecasts: any[] = [];
    const seenDates = new Set<string>();

    for (let forecast of forecasts) {
      const date = new Date(forecast.dt * 1000); 
      const dateString = date.toDateString();

      if (date.toDateString() === today.toDateString()) {
        continue; 
      }

    
      if (!seenDates.has(dateString) && date.getUTCHours() === 12) {
        dailyForecasts.push({
          ...forecast,
          localDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
          localTime: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        });
        seenDates.add(dateString);
      }

      
      if (dailyForecasts.length >= 3) {
        break;
      }
    }

    return dailyForecasts;
  }

  onSearch(): void {
    const cityRegex = /^[a-zA-Z\s]+$/;

    if (this.city && cityRegex.test(this.city)) {
      this.error = false;
      this.getWeather(this.city);
      this.getForecast(this.city);
    } else {
      this.error = true;
      
    }
  }

  getLocalTime(): string {
    if (!this.weatherData || !this.weatherData.dt || !this.weatherData.timezone) {
      return '';
    }

    const utcTime = this.weatherData.dt * 1000;
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const cityOffset = this.weatherData.timezone * 1000;

    const localTime = new Date(utcTime + localOffset + cityOffset);

    return localTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }
}
