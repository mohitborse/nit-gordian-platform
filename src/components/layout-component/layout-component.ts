import { Component } from '@angular/core';
import { DockMenuComponent } from '../dock-menu-component/dock-menu-component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-component',
  imports: [DockMenuComponent, RouterOutlet],
  templateUrl: './layout-component.html',
  styleUrl: './layout-component.scss',
  standalone: true
})
export class LayoutComponent {

}
