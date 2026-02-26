import { Injectable, signal } from '@angular/core';
import { Release } from '../models/release.modal';

const STORAGE_KEY = 'rp_v3';

const SAMPLE_DATA: Release[] = [
  { id: '1', title: 'Auth Service v3.1', pod: 'Panda', environment: 'PPD', date: '2026-02-05', time: '14:00', status: 'Completed', description: 'Authentication service update' },
  { id: '2', title: 'Frontend v8.2.0', pod: 'Avenger', environment: 'PPD', date: '2026-02-08', time: '10:00', status: 'Completed', description: 'UI improvements and bug fixes' },
  { id: '3', title: 'Auth Service v3.1', pod: 'Panda', environment: 'PROD', date: '2026-02-10', time: '15:00', status: 'Completed', description: 'Production rollout' },
  { id: '4', title: 'API Gateway v2.4.1', pod: 'Apollo', environment: 'PPD', date: '2026-02-14', time: '11:00', status: 'In Progress', description: 'Gateway performance improvements' },
  { id: '5', title: 'Payment Module v1.9', pod: 'Apollo', environment: 'PROD', date: '2026-02-23', time: '16:00', status: 'Planned', description: 'New payment providers support' },
  { id: '6', title: 'Notification Service', pod: 'Avenger', environment: 'PPD', date: '2026-02-23', time: '13:00', status: 'Planned', description: 'Push notification updates' },
  { id: '7', title: 'Mobile API v5.0', pod: 'Panda', environment: 'PPD', date: '2026-02-26', time: '14:00', status: 'Planned', description: 'Mobile app backend changes' },
  { id: '8', title: 'Database Migration', pod: 'Apollo', environment: 'PROD', date: '2026-02-28', time: '09:00', status: 'Planned', description: 'Schema updates for Q1' },
  { id: '9', title: 'Search Indexer v2', pod: 'Avenger', environment: 'PPD', date: '2026-02-28', time: '12:00', status: 'Planned', description: 'Elasticsearch upgrade' },
];

@Injectable({ providedIn: 'root' })
export class ReleaseService {
  releases = signal<Release[]>(this.load());

  private load(): Release[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with sample data if nothing in storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
        return SAMPLE_DATA;
      }
      return JSON.parse(stored);
    } catch {
      return SAMPLE_DATA;
    }
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.releases()));
  }

  add(r: Release) {
    this.releases.update(list => [...list, r]);
    this.persist();
  }

  update(r: Release) {
    this.releases.update(list =>
      list.map(item => item.id === r.id ? r : item)
    );
    this.persist();
  }

  delete(id: string) {
    this.releases.update(list => list.filter(r => r.id !== id));
    this.persist();
  }
}