import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-client-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-login.html',
})
export class ClientLoginComponent {
  form: FormGroup;
  feedbackMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private supabaseService: SupabaseService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async submit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.feedbackMessage = '';

    const { email, password } = this.form.value;
    const result = await this.supabaseService.signIn(email, password);

    if (result.success) {
      this.router.navigate(['/']);
    } else {
      this.feedbackMessage = result.error || 'Sign in failed';
    }

    this.isLoading = false;
  }
}
