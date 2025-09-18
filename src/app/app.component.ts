import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ClinicActions from './store/clinic-outcomes.actions';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { CommonModule, DatePipe } from '@angular/common';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ClinicOutcomesService } from './clinic-outcomes.service';

function createPattern(color: string): CanvasPattern {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext('2d')!;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.lineTo(8, 0);
  ctx.stroke();
  return ctx.createPattern(canvas, 'repeat')!;
}

const gmiColorMap: Record<string, string> = {
  '≤7%': '#8bc34a',
  '7-8%': '#ffeb3b',
  '>8%': '#f44336'
};

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [CommonModule, DatePipe, BaseChartDirective]
})
export class AppComponent implements OnInit {
  activePatients = 0;
  dateRangeStart: Date | null = null;
  dateRangeEnd: Date | null = null;
  lastUpdated: Date | null = null;
  averageGmi = 0;
  selectedRange = 30;

  barChartType: 'bar' = 'bar';
  pieChartType: 'pie' = 'pie';

  // Time in Range chart (5 buckets)
  timeInRangeChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [''],
    datasets: [
      { data: [0], backgroundColor: '#d32f2f', barPercentage: 0.25, categoryPercentage: 0.4 },           // Very Low (<54) dark red
      { data: [0], backgroundColor: createPattern('#f44336'), barPercentage: 0.25, categoryPercentage: 0.4 }, // Low (54–70) hatched red
      { data: [0], backgroundColor: '#8bc34a', barPercentage: 0.25, categoryPercentage: 0.4 },           // In Range (70–180) green
      { data: [0], backgroundColor: createPattern('#fbc02d'), barPercentage: 0.25, categoryPercentage: 0.4 }, // High (180–240) dashed orange
      { data: [0], backgroundColor: '#ff9800', barPercentage: 0.25, categoryPercentage: 0.4 }            // Very High (>240) solid orange
    ]
  };


  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: 'black',
        anchor: 'center',
        align: 'center',
        font: { weight: 'bold', size: 14 },
        formatter: (value: number) => (value > 0 ? `${value}%` : '')
      }
    },
    scales: {
      x: { stacked: true, display: false},
      y: { stacked: true, display: false, max: 100 }
    }
  };

  barChartPlugins = [ChartDataLabels];

  // GMI Pie chart
  gmiChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['≤7%', '7-8%', '>8%'],
    datasets: [{ data: [], backgroundColor: ['#8bc34a', '#ffeb3b', '#f44336'] }]
  };

  gmiChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: 160,
    plugins: {
      legend: { display: false },
      datalabels: {
        formatter: (value: number, ctx) => {
          const dataset = ctx.chart.data.datasets[0].data as number[];
          const sum = dataset.reduce((a, b) => a + b, 0);
          return sum > 0 ? `${Math.round((value / sum) * 100)}%` : '0%';
        },
        color: '#333',
        font: { weight: 'bold' },
        anchor: 'end',       
        align: 'end',        
        offset: 1,           
        clamp: true
      }
    }
  };
  
  constructor(
  private store: Store<{ clinic: any }>,
  private clinicService: ClinicOutcomesService
) {}

  private updateGmiChart(values: { [key: string]: number }) {
    const labels = Object.keys(values);
    const data = labels.map(l => values[l]);
    const backgroundColor = labels.map(l => gmiColorMap[l] || '#ccc');
    this.gmiChartData = { labels, datasets: [{ data, backgroundColor }] };
  }

  ngOnInit(): void {
    this.store.dispatch(ClinicActions.loadTimeInRange());
    this.store.dispatch(ClinicActions.loadGmi());
    this.setDateRange(this.selectedRange);

    // fallback mock (for initial view)
    this.timeInRangeChartData.datasets[0].data = [0];  // veryLow
    this.timeInRangeChartData.datasets[1].data = [2]; // low
    this.timeInRangeChartData.datasets[2].data = [82]; // inRange
    this.timeInRangeChartData.datasets[3].data = [15];  // high
    this.timeInRangeChartData.datasets[4].data = [1];  // veryHigh


    this.gmiChartData.datasets[0].data = [72, 23, 5];
    this.averageGmi = 6.7;
    this.activePatients = 120;
  }

  setDateRange(days: number) {
  this.selectedRange = days;
  const now = new Date();
  this.dateRangeEnd = now;
  this.dateRangeStart = new Date(now);
  this.dateRangeStart.setDate(now.getDate() - (days - 1));
  this.lastUpdated = now;

  // ✅ API A - Time in Range
  this.clinicService.getTimeInRange(days).subscribe(res => {
  this.timeInRangeChartData = {
  labels: [''],
  datasets: [
    { data: [res.veryLow], backgroundColor: '#d32f2f', barPercentage: 0.25, categoryPercentage: 0.4 },  // dark red
    { data: [res.low], backgroundColor: createPattern('#f44336'), barPercentage: 0.25, categoryPercentage: 0.4 },      // solid red
    { data: [res.inRange], backgroundColor: '#8bc34a', barPercentage: 0.25, categoryPercentage: 0.4 }, // green
    { data: [res.high], backgroundColor: createPattern('#fbc02d'), barPercentage: 0.25, categoryPercentage: 0.4 }, // hatched orange
    { data: [res.veryHigh], backgroundColor: '#ff9800', barPercentage: 0.25, categoryPercentage: 0.4 } // solid orange
  ]
};

});


  // ✅ API B - GMI
  this.clinicService.getGmi(days).subscribe(res => {
    this.updateGmiChart({ '≤7%': res['≤7%'], '7-8%': res['7-8%'], '>8%': res['>8%'] });
    this.averageGmi = res.average;
  });
}

}
