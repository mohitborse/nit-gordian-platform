import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { DockModule } from 'primeng/dock';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  command?: () => void;
}

@Component({
  selector: 'app-dock-menu-component',
  imports: [CommonModule, DockModule, RadioButtonModule, TooltipModule, FormsModule],
  templateUrl: './dock-menu-component.html',
  styleUrl: './dock-menu-component.scss',
  standalone: true
})
export class DockMenuComponent {
  items: MenuItem[] | undefined;
  position: string = 'top';
  positionOptions: any[] = [
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' }
  ];

  constructor(private router: Router) { }
  ngOnInit() {
   
    this.items = [
      {
        label: 'WSR',
        icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/clipboard-list.svg',
        command: () => {
          this.router.navigate(['/main/wsr']); 
        }
      },
      {
        label: 'Release Planner',
        icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/git-branch.svg',
        command: () => {
          this.router.navigate(['/main/release-planner']);
        }
      },
      {
        label: 'OnBoarding Plan',
        icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/users.svg',
        command: () => {
          this.router.navigate(['/main/onboarding']);
        }
      },
      {
        label: 'Leave Tracker',
        icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/plane.svg',
        command: () => {
          this.router.navigate(['/main/leave-tracker']);
        }
      },
      {
        label: 'Risk Tracker',
        icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/shield-alert.svg',
        command: () => {
          this.router.navigate(['/main/risk-tracker']);
        }
      },
      {
        label: 'Sprint Dashboard',
        icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/activity.svg',
        command: () => {
          this.router.navigate(['/main/sprint-dashboard']);
        }
      }
    ];
  }
}
