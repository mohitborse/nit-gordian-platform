export interface Release {
  id: string;
  title: string;
  description?: string;
  environment: 'PPD' | 'PROD';
  pod: 'Panda' | 'Avenger' | 'Apollo' | 'Other';
  date: string;
  time?: string;
  status: 'Planned' | 'In Progress' | 'Completed';
}
