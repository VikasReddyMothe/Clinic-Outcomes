import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ClinicActions from './clinic-outcomes.actions';
import { ClinicOutcomesService } from '../clinic-outcomes.service';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class ClinicEffects {
  loadTimeInRange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicActions.loadTimeInRange),
      mergeMap(() =>
        this.ClinicOutcomesService.getTimeInRange(30).pipe(
          map(data => ClinicActions.loadTimeInRangeSuccess(data))
        )
      )
    )
  );

  loadGmi$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicActions.loadGmi),
      mergeMap(() =>
        this.ClinicOutcomesService.getGmi(30).pipe(
          map(data => ClinicActions.loadGmiSuccess(data))
        )
      )
    )
  );

  constructor(private actions$: Actions, private ClinicOutcomesService: ClinicOutcomesService) {}
}
