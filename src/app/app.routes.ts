import { Routes } from '@angular/router';
import { HomePageComponent } from '../components/home-page-component/home-page-component';
import { AppComponent } from './app';
export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePageComponent },
    {
        path: 'main', loadComponent: () => import('../components/layout-component/layout-component').then(m => m.LayoutComponent),
        children: [
            { path: '', redirectTo: 'release-planner', pathMatch: 'full' },
            { path: 'release-planner', loadComponent: () => import('../components/calendar/calendar').then(m => m.CalendarComponent), },
            { path: 'wsr', loadComponent: () => import('../components/weekly-report-component/weekly-report-component').then(m => m.WeeklyReportComponent) },
            { path: 'sprint-dashboard', loadComponent: () => import('../components/sprint-dashboard/sprint-dashboard').then(m => m.SprintDashboard) },
        ]

    },
    { path: '**', redirectTo: 'home' }

];

