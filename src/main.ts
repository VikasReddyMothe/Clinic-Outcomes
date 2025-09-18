import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { clinicReducer } from './app/store/clinic-outcomes.reducer';

// Chart.js setup
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components + datalabels plugin
Chart.register(...registerables, ChartDataLabels);

// Bootstrap Angular app with NgRx store + HttpClient
bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ clinic: clinicReducer }),
    provideHttpClient()   // 👈 this is required for HttpClient to work
  ]
}).catch(err => console.error(err));
