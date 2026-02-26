import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReleaseService } from '../../services/release.service';
import { Release } from '../../models/release.modal';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss',
  standalone: true
})
export class SidebarComponent {
  @Input() selectedDate: string | null = null;
  @Output() editRelease = new EventEmitter<Release>();
  @Output() deleteRelease = new EventEmitter<string>();

  constructor(public releaseService: ReleaseService) { }

  get formattedDate(): string {
    if (!this.selectedDate) {
      const today = new Date();
      return today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    const [y, m, d] = this.selectedDate.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  get dayOfWeek(): string {
    if (!this.selectedDate) {
      const today = new Date();
      return today.toLocaleDateString('en-US', { weekday: 'long' });
    }
    const [y, m, d] = this.selectedDate.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  get releasesForSelectedDate(): Release[] {
    if (!this.selectedDate) return [];
    return this.releaseService.releases().filter(r => r.date === this.selectedDate);
  }

  get totalReleases(): number {
    // if (!this.selectedDate) 
    return this.releaseService.releases().length;
    //return this.releasesForSelectedDate.length;
  }

  get ppdCount(): number {
    //if (!this.selectedDate) {
    return this.releaseService.releases().filter(r => r.environment === 'PPD').length;
    // }
    // return this.releasesForSelectedDate.filter(r => r.environment === 'PPD').length;
  }

  get prodCount(): number {
    //if (!this.selectedDate) {
    return this.releaseService.releases().filter(r => r.environment === 'PROD').length;
    // }
    // return this.releasesForSelectedDate.filter(r => r.environment === 'PROD').length;
  }

  getPodIcon(pod: string): string {
    const icons: Record<string, string> = {
      'Panda': '🐼',
      'Avenger': '⚡',
      'Apollo': '🚀',
      'Other': '📦'
    };
    return icons[pod] || '📦';
  }

  formatTime(time?: string): string {
    if (!time) return '2:00 PM';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  }

  onEdit(release: Release) {
    this.editRelease.emit(release);
  }

  onDelete(releaseId: string) {
    if (confirm('Are you sure you want to delete this release?')) {
      this.releaseService.delete(releaseId);
    }
  }
}
