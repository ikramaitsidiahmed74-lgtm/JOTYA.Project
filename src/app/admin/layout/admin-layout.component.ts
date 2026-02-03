import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarAdminComponent } from '../components/sidebar-admin/sidebar-admin.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarAdminComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: [],
})
export class AdminLayoutComponent {}
