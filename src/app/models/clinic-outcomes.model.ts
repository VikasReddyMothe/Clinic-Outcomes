

export interface TimeInRangeData {
  veryLow: number;   // <54
  low: number;       // 54–70
  inRange: number;   // 70–180
  high: number;      // 180–240
  veryHigh: number;  // >240
}


export interface GmiData {
  averageGmi: number;
  green: number;
  yellow: number;
  red: number;
}
