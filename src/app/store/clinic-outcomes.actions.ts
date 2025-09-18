import { createAction, props } from '@ngrx/store';

export const loadTimeInRange = createAction('[Clinic] Load Time In Range');
export const loadTimeInRangeSuccess = createAction(
  '[Clinic] Load Time In Range Success',
  props<{ veryLow: number; low: number; inRange: number; high: number }>()
);

export const loadGmi = createAction('[Clinic] Load GMI');
export const loadGmiSuccess = createAction(
  '[Clinic] Load GMI Success',
  props<{ green: number; yellow: number; red: number; averageGmi: number }>()
);
