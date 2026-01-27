import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header2',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header2.html',
  styleUrls: ['./header2.css'],
})
export class Header2 {}
