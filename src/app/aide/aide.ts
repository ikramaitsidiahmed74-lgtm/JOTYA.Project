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
  showSuccessToast = false;

  constructor(private supabaseService: SupabaseService) {}

  openMaps(): void {
    window.open(this.mapsUrl, '_blank');
  }

  /**
   * Shows success toast and auto-hides it after 4 seconds with fade-out animation
   */
  private showSuccessNotification(): void {
    this.showSuccessToast = true;
    console.log('Toast should be visible now:', this.showSuccessToast);
    // Auto-hide after 4 seconds
    setTimeout(() => {
      this.showSuccessToast = false;
      console.log('Toast hidden');
    }, 4000);
  }

  async submitMessage(): Promise<void> {
    // Trim whitespace and validate
    const trimmedEmail = this.email?.trim() || '';
    const trimmedMessage = this.message?.trim() || '';

    if (!trimmedEmail || !trimmedMessage) {
      this.feedbackMessage = 'Veuillez remplir tous les champs requis';
      this.showSuccessToast = false;
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      this.feedbackMessage = 'Veuillez entrer une adresse email valide';
      this.showSuccessToast = false;
      return;
    }

    this.isLoading = true;
    this.feedbackMessage = '';
    this.showSuccessToast = false;

    try {
      const result = await this.supabaseService.saveSupportMessage({
        email: trimmedEmail,
        message: trimmedMessage,
      });

      if (result.success) {
        console.log('Message sent successfully!');
        this.email = '';
        this.message = '';
        this.feedbackMessage = '';
        // Small delay to ensure UI updates
        setTimeout(() => {
          this.showSuccessNotification();
        }, 100);
      } else {
        console.error('Failed to send message:', result.error);
        this.feedbackMessage = result.error || 'Échec de l\'envoi du message. Veuillez réessayer.';
        this.showSuccessToast = false;
      }
    } catch (error: any) {
      this.feedbackMessage = error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      this.showSuccessToast = false;
    } finally {
      this.isLoading = false;
    }
  }
}
