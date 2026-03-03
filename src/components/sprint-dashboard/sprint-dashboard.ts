import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark' | 'glass' | 'neon' | 'corporate';

@Component({
  selector: 'app-sprint-dashboard',
  imports: [CommonModule],
  templateUrl: './sprint-dashboard.html',
  styleUrl: './sprint-dashboard.scss',
  standalone: true
})
export class SprintDashboard {
  // theme = signal<ThemeMode>(this.getInitialTheme());

  // private getInitialTheme(): ThemeMode {
  //   const saved = localStorage.getItem('dashboard-theme') as ThemeMode | null;
  //   return saved ?? 'light';
  // }

  // setTheme(mode: ThemeMode) {
  //   this.theme.set(mode);
  //   localStorage.setItem('dashboard-theme', mode);
  // }


  currentTimestamp = signal(new Date());

  sprintData = signal({
    "sprint": { "name": "Sprint 24", "startDate": "2026-02-01", "endDate": "2026-02-14" },
    "summary": { "plannedStoryPoints": 120, "deliveredStoryPoints": 102, "spilloverPoints": 18, "velocity": 102, "completionRate": 85 },
    "defects": {
      "totalLogged": 26, "closed": 19, "active": 7,
      "trend": {
        "createdPerDay": [
          { "date": "2026-02-01", "count": 10 }, { "date": "2026-02-02", "count": 3 },
          { "date": "2026-02-03", "count": 5 }, { "date": "2026-02-04", "count": 2 },
          { "date": "2026-02-05", "count": 4 }
        ],
        "closedPerDay": [
          { "date": "2026-02-01", "count": 1 }, { "date": "2026-02-02", "count": 2 },
          { "date": "2026-02-03", "count": 2 }, { "date": "2026-02-04", "count": 4 },
          { "date": "2026-02-05", "count": 3 }
        ]
      }
    },
    "userMetrics": [
      { "user": "John", "storyCount": 5, "bugCount": 13, "storyPoints": 28, "utilizationPercent": 87 },
      { "user": "Priya", "storyCount": 6, "bugCount": 2, "storyPoints": 35, "utilizationPercent": 95 }
    ],
    "risks": {
      "agingItems": [
        { "id": 1012, "title": "Payment API integration", "daysOpen": 9 },
        { "id": 1045, "title": "Auth Middleware Refactor", "daysOpen": 4 }
      ],
      "blockedItems": 2, "unassignedItems": 1
    },
    "charts": {
      "storyPointsTrend": [
        { "sprint": "Sprint 22", "planned": 110, "delivered": 105 },
        { "sprint": "Sprint 23", "planned": 115, "delivered": 108 },
        { "sprint": "Sprint 24", "planned": 120, "delivered": 102 }
      ]
    },
    "kpis": [
      { "label": "Sprint Health", "value": "Healthy", "indicator": "green" },
      { "label": "Defect Leakage", "value": "Moderate", "indicator": "yellow" }
    ],
    "executiveSummary": [
      "Sprint delivery rate is 85% with 102 story points completed.",
      "Defect inflow is slightly higher than closure rate.",
      "2 work items are currently blocked."
    ]
  });

  // Dynamic Summary Computation
  summary = computed(() => {
    const data = this.sprintData().summary;
    return {
      planned: data.plannedStoryPoints,
      delivered: data.deliveredStoryPoints,
      spillover: data.plannedStoryPoints - data.deliveredStoryPoints,
      velocity: data.velocity,
      completion: Math.round((data.deliveredStoryPoints / data.plannedStoryPoints) * 100)
    };
  });

  // Dynamic Chart Scaling
  defectMaxCount = computed(() => {
    const created = this.sprintData().defects.trend.createdPerDay.map(d => d.count);
    const closed = this.sprintData().defects.trend.closedPerDay.map(d => d.count);
    return Math.max(...created, ...closed, 5); // Fallback to 5 for scale
  });

  simulateDataChange() {
    this.currentTimestamp.set(new Date());
    this.sprintData.update(current => ({
      ...current,
      summary: {
        ...current.summary,
        deliveredStoryPoints: Math.min(current.summary.plannedStoryPoints, current.summary.deliveredStoryPoints + 2)
      },
      defects: {
        ...current.defects,
        active: Math.max(0, current.defects.active + (Math.random() > 0.5 ? 1 : -1))
      }
    }));
  }
}
