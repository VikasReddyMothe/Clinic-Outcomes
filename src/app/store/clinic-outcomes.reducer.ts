// src/app/store/clinic-outcomes.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as ClinicActions from './clinic-outcomes.actions';

export interface ClinicState {
  timeInRange?: {
    veryLow: number;
    low: number;
    inRange: number;
    high: number;
  };
  gmi?: {
    green: number;
    yellow: number;
    red: number;
    averageGmi: number;
  };
  activePatients?: number;
  dateRange?: string;
  lastUpdated?: string;
}

// 👇 calculate dynamic dates
const now = new Date();
const end = new Date(now);
const start = new Date(now);
start.setDate(start.getDate() - 29);

export const initialState: ClinicState = {
  timeInRange: { veryLow: 1, low: 15, inRange: 82, high: 2 },
  gmi: { green: 72, yellow: 23, red: 5, averageGmi: 6.7 },
  activePatients: 120,
  // 👇 use dynamic values instead of hardcoded 2024
  dateRange: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
  lastUpdated: now.toLocaleString(),
};

export const clinicReducer = createReducer(
  initialState,
  on(ClinicActions.loadTimeInRange, (state) => ({ ...state })),
  on(ClinicActions.loadGmi, (state) => ({ ...state })),
);
