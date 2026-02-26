
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { ReleaseService } from '../../services/release.service';
import { Release } from '../../models/release.modal';
import { HeaderComponent } from '../header/header-component';
import { SidebarComponent } from '../sidebar-component/sidebar-component';
import { ReleaseModalComponent } from '../release-modal/release-modal';
import { HomePageComponent } from '../home-page-component/home-page-component';
import { DockMenuComponent } from '../dock-menu-component/dock-menu-component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [CommonModule, HeaderComponent, SidebarComponent, ReleaseModalComponent]
})
export class CalendarComponent {
  @ViewChild(ReleaseModalComponent) modal!: ReleaseModalComponent;

  filter = signal<{ env: string; status: string, pod: string }>({ env: 'all', status: 'all', pod: 'all' });

  selectedDate = signal<string | null>(null);
  // filter: { env: string; status: string, pod: string } = { env: 'all', status: 'all', pod: 'all' };
  // @Input() filter =  { env: string; status: string, pod: string } = { env: 'all', status: 'all', pod: 'all' };
  // @Input() filter: { env: string; status: string, pod: string } = { env: 'all', status: 'all', pod: 'all' };

  @Output() dateSelected = new EventEmitter<string>();

  today = new Date();
  viewYear = signal(this.today.getFullYear());
  viewMonth = signal(this.today.getMonth());
  // selectedDate = signal<string | null>(null);

  daysShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  constructor(public releaseService: ReleaseService) { }

  getPodIcon(pod: string): string {
    const icons: Record<string, string> = {
      'Panda': '🐼',
      'Avenger': '⚡',
      'Apollo': '🚀',
      'Other': '📦'
    };
    return icons[pod] || '📦';
  }

  get monthLabel(): string {
    return new Date(this.viewYear(), this.viewMonth())
      .toLocaleString('default', { month: 'long' });
  }

  get monthYear(): number {
    return this.viewYear();
  }

  prevMonth() {
    let m = this.viewMonth() - 1;
    let y = this.viewYear();
    if (m < 0) {
      m = 11;
      y--;
    }
    this.viewMonth.set(m);
    this.viewYear.set(y);
  }

  nextMonth() {
    let m = this.viewMonth() + 1;
    let y = this.viewYear();
    if (m > 11) {
      m = 0;
      y++;
    }
    this.viewMonth.set(m);
    this.viewYear.set(y);
  }

  goNow() {
    const now = new Date();
    this.viewMonth.set(now.getMonth());
    this.viewYear.set(now.getFullYear());
  }

  selectDate(date: string) {
    this.selectedDate.set(date);
  }

  isToday(date: string): boolean {
    const t = new Date();
    const todayStr = `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')}`;
    return date === todayStr;
  }

  get calendarCells() {
    const firstDay = new Date(this.viewYear(), this.viewMonth(), 1).getDay();
    const daysInMonth = new Date(this.viewYear(), this.viewMonth() + 1, 0).getDate();

    const cells: any[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push({
        day: '',
        date: '',
        releases: []
      });
    }

    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${this.viewYear()}-${(this.viewMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const dayReleases = this.releaseService.releases()
        .filter(r => r.date === dateStr)
        .map(r => ({
          ...r,
          podIcon: this.getPodIcon(r.pod)
        }));

      cells.push({
        day: i,
        date: dateStr,
        releases: dayReleases
      });
    }

    if (this.filter().env.toLowerCase() !== 'all') {
      cells.forEach(cell => {
        cell.releases = cell.releases.filter(
          (r: Release) => r.environment.toLowerCase() === this.filter().env.toLowerCase()
        );
      });
    }
    if (this.filter().status.toLowerCase() !== 'all') {
      cells.forEach(cell => {
        cell.releases = cell.releases.filter(
          (r: Release) => r.status.toLowerCase() === this.filter().status.toLowerCase()
        );
      });
    }
    if (this.filter().pod.toLowerCase() !== 'all') {
      cells.forEach(cell => {
        cell.releases = cell.releases.filter(
          (r: Release) => r.pod.toLowerCase() === this.filter().pod.toLowerCase()
        );
      });
    }

    return cells;
  }

  filterChange(filter: { env: string; status: string, pod: string }) {
    // Implement filter change logic if needed
    this.filter.set({ ...filter });
  }

  onNewRelease() {
    this.modal?.openModal();
  }
  onEditRelease(release: Release) {
    this.modal?.openEditModal(release);
  }
}