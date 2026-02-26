import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-page-component',
  imports: [],
  templateUrl: './home-page-component.html',
  styleUrl: './home-page-component.scss',
})
export class HomePageComponent {
  constructor(private router: Router) { }
  
  getStarted = () => {
    this.router.navigate(['/main/release-planner']);
  }

}
