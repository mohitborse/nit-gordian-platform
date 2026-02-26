import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

interface WeeklyUpdate {
  id: number;
  date: string;
  status: 'Pending' | 'Submitted';
  team?: string;       // Team code like 'A', 'B', 'C'
  persona?: number;    // Persona id
  data: any;
}

@Component({
  selector: 'app-weekly-report-component',
  imports: [Select, ButtonModule, CommonModule, ReactiveFormsModule, FormsModule, EditorModule
    , InputTextModule, BadgeModule, TagModule, DividerModule, ToastModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './weekly-report-component.html',
  styleUrl: './weekly-report-component.scss',
  standalone: true
})
export class WeeklyReportComponent {

  teams = [
    { name: 'Team Alpha', code: 'A' },
    { name: 'Team Beta', code: 'B' },
    { name: 'Team Gamma', code: 'C' }
  ];

  personas = [
    { name: 'Persona 1', id: 1 },
    { name: 'Persona 2', id: 2 },
    { name: 'Persona 3', id: 3 }
  ];

  selectedTeam: any = null;
  selectedPersona: any = null;
  nextClick: boolean = false;

  goNext() {
    if (!this.selectedTeam || !this.selectedPersona) {
      alert('Please select both Team and Persona!');
      return;
    }
    this.createNextEntry();
    this.nextClick = true;

    // Reset selected update to first filtered one
    const filtered = this.filteredUpdates;
    if (filtered.length > 0) {
      this.selectUpdate(filtered[0]);
    } else {
      this.selectedUpdate = null; // No entries yet
      this.form.reset();
    }
  }

  updates: WeeklyUpdate[] = [];
  selectedUpdate: WeeklyUpdate | null = null;;
  form!: FormGroup;
  idCounter = 1;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadFromStorage();
    this.initForm();

    //if (this.updates.length === 0) {

    //}
  }

  initForm() {
    this.form = this.fb.group({
      weeklyTasks: ['', Validators.required],
      highlights: ['', Validators.required],
      plannedStories: ['', Validators.required],
      deliveredStories: ['', Validators.required],
      plannedPoints: ['', Validators.required],
      deliveredPoints: ['', Validators.required],
      qaDefects: ['', Validators.required],
      uatDefects: ['', Validators.required],
      capacity: ['', Validators.required],
      actualHours: ['', Validators.required]
    });
  }

  selectUpdate(update: WeeklyUpdate) {
    this.selectedUpdate = update;
    this.form.reset();
    this.form.patchValue(update.data || {});
  }

  createNextEntry2() {
    this.confirmationService.confirm({
      message: 'Create next working day entry?',
      accept: () => {
        const nextDate = this.getNextWorkingDay();

        const newEntry: WeeklyUpdate = {
          id: this.idCounter++,
          date: nextDate.toISOString(),
          status: 'Pending',
          team: this.selectedTeam.code,       // store team
          persona: this.selectedPersona.id,   // store persona
          data: {}
        };

        this.updates.push(newEntry);
        this.selectedUpdate = newEntry;
        this.form.reset();
        this.saveToStorage();
      }
    });
  }

  getNextWorkingDay(): Date {
    let date = new Date();

    if (this.updates.length > 0) {
      date = new Date(this.updates[this.updates.length - 1].date);
      date.setDate(date.getDate() + 1);
    }

    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }

    return date;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.selectedUpdate) {
      this.selectedUpdate.data = this.form.value;
      this.selectedUpdate.status = 'Submitted';
    }

    this.saveToStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Weekly update submitted'
    });
  }

  get pendingCount() {
    return this.updates.filter(u => u.status === 'Pending' && u.team === this.selectedTeam?.code && u.persona === this.selectedPersona?.id).length;
  }

  saveToStorage() {
    localStorage.setItem('weeklyUpdates', JSON.stringify(this.updates));
  }

  loadFromStorage() {
    const data = localStorage.getItem('weeklyUpdates');
    if (data) {
      this.updates = JSON.parse(data);
      this.idCounter = this.updates.length + 1;
      this.selectedUpdate = this.updates[0];
    }
  }

  get filteredUpdates() {
    if (!this.selectedTeam || !this.selectedPersona) return [];
    return this.updates.filter(
      u => u.team === this.selectedTeam.code && u.persona === this.selectedPersona.id
    );
  }

  createNextEntry3() {

    if (!this.selectedTeam) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select Team'
      });
      return;
    }

    const targetDate = this.getTargetTuesday();

    this.personas.forEach(persona => {

      const alreadyExists = this.updates.some(u =>
        u.team === this.selectedTeam.code &&
        u.persona === persona.id &&
        new Date(u.date).getTime() === targetDate.getTime()
      );

      if (!alreadyExists) {
        const newEntry: WeeklyUpdate = {
          id: this.idCounter++,
          date: targetDate.toISOString(),
          status: 'Pending',
          team: this.selectedTeam.code,
          persona: persona.id,
          data: {}
        };

        this.updates.push(newEntry);
      }
    });

    this.saveToStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Tuesday entries processed'
    });
  }

  createNextEntry4() {

    if (!this.selectedTeam) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select Team'
      });
      return;
    }

    const now = new Date();
    const tuesday = this.getCurrentWeekTuesday();

    const tenAM = new Date(tuesday);
    tenAM.setHours(10, 0, 0, 0);

    const twelvePM = new Date(tuesday);
    twelvePM.setHours(12, 0, 0, 0);

    this.personas.forEach(persona => {

      // 🔎 Check 10AM entry exists
      const tenExists = this.updates.some(u =>
        u.team === this.selectedTeam.code &&
        u.persona === persona.id &&
        new Date(u.date).getTime() === tenAM.getTime()
      );

      // 🔎 Check 12PM entry exists
      const twelveExists = this.updates.some(u =>
        u.team === this.selectedTeam.code &&
        u.persona === persona.id &&
        new Date(u.date).getTime() === twelvePM.getTime()
      );

      // ✅ If 10AM entry missing → create it
      if (!tenExists) {
        this.updates.push({
          id: this.idCounter++,
          date: tenAM.toISOString(),
          status: 'Pending',
          team: this.selectedTeam.code,
          persona: persona.id,
          data: {}
        });
      }

      // ✅ If time crossed 10AM AND 12PM entry missing → create 12PM entry
      if (now > tenAM && !twelveExists) {
        this.updates.push({
          id: this.idCounter++,
          date: twelvePM.toISOString(),
          status: 'Pending',
          team: this.selectedTeam.code,
          persona: persona.id,
          data: {}
        });
      }

    });

    this.saveToStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Processed',
      detail: 'Tuesday entries checked and created if needed'
    });
  }

  createNextEntry5() {

    if (!this.selectedTeam) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select Team'
      });
      return;
    }

    const now = new Date();
    const tuesday = this.getCurrentWeekTuesday();

    const tenAM = new Date(tuesday);
    tenAM.setHours(10, 0, 0, 0);

    const twelvePM = new Date(tuesday);
    twelvePM.setHours(12, 0, 0, 0);

    this.personas.forEach(persona => {

      // 🔎 Check 10AM entry exists
      const tenExists = this.updates.some(u =>
        u.team === this.selectedTeam.code &&
        u.persona === persona.id &&
        new Date(u.date).getTime() === tenAM.getTime()
      );

      // 🔎 Check 12PM entry exists
      const twelveExists = this.updates.some(u =>
        u.team === this.selectedTeam.code &&
        u.persona === persona.id &&
        new Date(u.date).getTime() === twelvePM.getTime()
      );

      // ✅ If 10AM entry missing → create it
      if (!tenExists) {
        this.updates.push({
          id: this.idCounter++,
          date: tenAM.toISOString(),
          status: 'Pending',
          team: this.selectedTeam.code,
          persona: persona.id,
          data: {}
        });
      }

      // ✅ If time crossed 10AM AND 12PM entry missing → create 12PM entry
      if (now > tenAM && !twelveExists) {
        this.updates.push({
          id: this.idCounter++,
          date: twelvePM.toISOString(),
          status: 'Pending',
          team: this.selectedTeam.code,
          persona: persona.id,
          data: {}
        });
      }

    });

    this.saveToStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Processed',
      detail: 'Tuesday entries checked and created if needed'
    });
  }
  createNextEntry() {

    if (!this.selectedTeam) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select Team'
      });
      return;
    }

    const now = new Date();
    const previousTuesday = this.getPreviousTuesday();
    const nextTuesday = this.getNextTuesday();

    const twelvePMToday = new Date(now);
    twelvePMToday.setHours(12, 0, 0, 0);

    this.personas.forEach(persona => {

      // 🔎 Check previous Tuesday entry
      const prevExists = this.updates.some(u =>
        u.team === this.selectedTeam.code &&
        u.persona === persona.id &&
        new Date(u.date).getTime() === previousTuesday.getTime()
      );

      // ✅ If missing → create previous Tuesday entry
      if (!prevExists) {
        this.updates.push({
          id: this.idCounter++,
          date: previousTuesday.toISOString(),
          status: 'Pending',
          team: this.selectedTeam.code,
          persona: persona.id,
          data: {}
        });
      }

      // 🔎 If time crossed 12PM → create next Tuesday entry
      if (now >= twelvePMToday) {

        const nextExists = this.updates.some(u =>
          u.team === this.selectedTeam.code &&
          u.persona === persona.id &&
          new Date(u.date).getTime() === nextTuesday.getTime()
        );

        if (!nextExists) {
          this.updates.push({
            id: this.idCounter++,
            date: nextTuesday.toISOString(),
            status: 'Pending',
            team: this.selectedTeam.code,
            persona: persona.id,
            data: {}
          });
        }
      }

    });

    this.saveToStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Processed',
      detail: 'Weekly Tuesday entries verified'
    });
  }
  private getTargetTuesday(): Date {
    const now = new Date();
    const target = new Date(now);

    const day = target.getDay(); // 0=Sun, 1=Mon, 2=Tue...

    // Calculate nearest Tuesday
    const diff = (2 - day + 7) % 7;
    target.setDate(target.getDate() + diff);
    target.setHours(10, 0, 0, 0);

    // If today is Tuesday and 10AM is already crossed
    if (day === 2) {
      const tenAM = new Date(now);
      tenAM.setHours(10, 0, 0, 0);

      if (now >= tenAM) {
        // Move to next Tuesday
        target.setDate(target.getDate() + 7);
      }
    }

    return target;
  }

  private getCurrentWeekTuesday(): Date {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon, 2=Tue...

    const diff = (2 - day + 7) % 7;
    const tuesday = new Date(now);
    tuesday.setDate(now.getDate() + diff);

    return tuesday;
  }

  private getNextTuesday(): Date {
    const now = new Date();
    const day = now.getDay();

    const diff = (2 - day + 7) % 7 || 7;

    const nextTuesday = new Date(now);
    nextTuesday.setDate(now.getDate() + diff);
    nextTuesday.setHours(10, 0, 0, 0);

    return nextTuesday;
  }

  private getPreviousTuesday(): Date {
    const now = new Date();
    const day = now.getDay(); // 0=Sun ... 2=Tue

    const diff = (day >= 2)
      ? day - 2
      : day + 5; // If Sun/Mon go back to last Tuesday

    const prevTuesday = new Date(now);
    prevTuesday.setDate(now.getDate() - diff);
    prevTuesday.setHours(10, 0, 0, 0);

    return prevTuesday;
  }

}
