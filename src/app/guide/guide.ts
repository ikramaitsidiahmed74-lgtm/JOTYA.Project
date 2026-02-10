import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-guides',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './guide.html',
  styleUrl: './guide.css',
})
export class Guide {}
