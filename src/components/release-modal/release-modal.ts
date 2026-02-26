import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ReleaseService } from '../../services/release.service';
import { Release } from '../../models/release.modal';

export interface ReleaseFormData {
  title: string;
  description?: string;
  environment: 'PPD' | 'PROD';
  pod: 'Panda' | 'Avenger' | 'Apollo' | 'Other';
  date: Date;
  time?: string;
  status: 'Planned' | 'In Progress' | 'Completed';
}

@Component({
  selector: 'app-release-modal',
  templateUrl: './release-modal.component.html',
  styleUrls: ['./release-modal.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Select, DatePicker, Dialog, InputText, Textarea]
})
export class ReleaseModalComponent {

  visible: boolean = false;
  isEditMode: boolean = false;
  editingId: string | null = null;

  releaseForm: FormGroup;

  envOptions = [
    { label: 'PPD', value: 'PPD' },
    { label: 'PROD', value: 'PROD' }
  ];

  podOptions = [
    { label: '🐼 Panda', value: 'Panda' },
    { label: '⚡ Avenger', value: 'Avenger' },
    { label: '🚀 Apollo', value: 'Apollo' },
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

  statusOptions = [
    { label: 'Planned', value: 'Planned' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' }
  ];

  constructor(private fb: FormBuilder, private releaseService: ReleaseService) {
    this.releaseForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      environment: ['PPD', Validators.required],
      pod: ['Panda', Validators.required],
      date: [null, Validators.required],
      time: ['14:00'],
      status: ['Planned']
    });
  }

  openModal() {
    this.visible = true;
    this.isEditMode = false;
    this.editingId = null;
    this.releaseForm.reset({ environment: 'PPD', pod: 'Panda', time: '14:00', status: 'Planned' });
  }

  openEditModal(release: Release) {
    this.visible = true;
    this.isEditMode = true;
    this.editingId = release.id;

    // Convert string date to Date object for p-calendar
    const [year, month, day] = release.date.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    this.releaseForm.patchValue({
      title: release.title,
      description: release.description || '',
      environment: release.environment,
      pod: release.pod,
      date: dateObj,
      time: release.time || '14:00',
      status: release.status
    });
  }

  onClose() {
    this.visible = false;
    this.releaseForm.reset({ environment: 'PPD', pod: 'Panda', time: '14:00', status: 'Planned' });
  }

  onSave() {
    if (this.releaseForm.valid) {
      const formValue = this.releaseForm.value;

      // Convert Date object to string format yyyy-mm-dd
      const date = formValue.date as Date;
      const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

      if (this.isEditMode && this.editingId) {
        // Update existing release
        const updatedRelease: Release = {
          id: this.editingId,
          title: formValue.title,
          description: formValue.description,
          environment: formValue.environment,
          pod: formValue.pod,
          date: dateStr,
          time: formValue.time,
          status: formValue.status
        };
        this.releaseService.update(updatedRelease);
      } else {
        // Add new release
        const newRelease: Release = {
          id: crypto.randomUUID(),
          title: formValue.title,
          description: formValue.description,
          environment: formValue.environment,
          pod: formValue.pod,
          date: dateStr,
          time: formValue.time,
          status: formValue.status
        };
        this.releaseService.add(newRelease);
      }

      this.onClose();
    } else {
      this.releaseForm.markAllAsTouched();
    }
  }
}