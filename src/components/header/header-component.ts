import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-header',
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.scss'],
  standalone: true,
  imports: [CommonModule, Select, FormsModule]
})
export class HeaderComponent {

  @Output() filterChange = new EventEmitter<any>();
  @Output() addRelease = new EventEmitter<void>();

  filters = {
    env: 'all',
    status: 'all',
    pod: 'all'
  };

  selectedPod: string = 'all';

  podOptions = [
  { label: '🌐 All', value: 'all' },
  { label: '🚀 Apollo', value: 'Apollo' },
  { label: '⚡ Avenger', value: 'Avenger' },
  { label: '🐼 Panda', value: 'Panda' },
  { label: '🧭 Pathfinder', value: 'Pathfinder' },
  { label: '🔥 Teamfire', value: 'Teamfire' },
  { label: '✈️ VFA', value: 'VFA' },
  { label: '📍 Siteliness', value: 'Siteliness' },
  { label: '🕵️ Detective', value: 'Detective' },
  { label: '🆔 Identifire', value: 'Identifire' },
  { label: '🔐 E-Gordian', value: 'Egordian' },
  { label: '⚔️ Samurai', value: 'Samurai' },
  { label: '🏹 Ranger', value: 'Ranger' },
  { label: '📊 BDR', value: 'BDR' },
  { label: '🚒 FireFighter', value: 'FireFighter' },
  { label: '☁️ Salesforce', value: 'Salesforce' }
];

  setFilter(type: 'env' | 'status' | 'pod', value: string) {
    this.filters[type] = value;
    this.filterChange.emit(this.filters);
  }

  isActive(type: 'env' | 'status' | 'pod', value: string): boolean {
    return this.filters[type] === value;
  }

  openModal() {
    this.addRelease.emit();
  }
}