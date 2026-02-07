import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-aide',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aide.html',
  styleUrls: ['./aide.css'],
})
export class Aide {
  mapsUrl = 'https://maps.app.goo.gl/NhfQZFbHoEiPuNwk6';
  
  email = '';
  message = '';
  feedbackMessage = '';
  isLoading = false;

  constructor(private supabaseService: SupabaseService) {}

  openMaps(): void {
    window.open(this.mapsUrl, '_blank');
  }

  async submitMessage(): Promise<void> {
    if (!this.email || !this.message) {
      this.feedbackMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.feedbackMessage = '';

    const result = await this.supabaseService.saveSupportMessage({
      email: this.email,
      message: this.message,
    });

    if (result.success) {
      this.feedbackMessage = 'Message sent successfully!';
      this.email = '';
      this.message = '';
    } else {
      this.feedbackMessage = result.error || 'Failed to send message';
    }

    this.isLoading = false;
  }
}
