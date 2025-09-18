import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicOutcomesService {
  constructor(private http: HttpClient) {}

  // Mock API call A (Time in Range)

  getTimeInRange(days: number): Observable<any> {
  const response: Record<number, any> = {
    30: { veryLow: 0, low: 2, inRange: 82, high: 15, veryHigh: 1 },
    60: { veryLow: 3, low: 9, inRange: 70, high: 15, veryHigh: 2 },
    90: { veryLow: 2, low: 15, inRange: 55, high: 25, veryHigh: 3 }
  };
  return of(response[days]);
}


  // Mock API call B (GMI)
  getGmi(days: number): Observable<any> {
    const response: Record<number, any> = {
      30: { '≤7%': 72, '7-8%': 23, '>8%': 5, average: 6.7 },
      60: { '≤7%': 60, '7-8%': 30, '>8%': 10, average: 7.2 },
      90: { '≤7%': 50, '7-8%': 35, '>8%': 15, average: 7.8 }
    };
    return of(response[days]);
  }

}
