import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-client-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-register.html',
})
export class ClientRegisterComponent {
  clientRegisterForm: FormGroup;
  feedbackMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private supabaseService: SupabaseService
  ) {
    this.clientRegisterForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  async submit() {
    if (this.clientRegisterForm.invalid) return;

    // Validate passwords match
    if (
      this.clientRegisterForm.value.password !==
      this.clientRegisterForm.value.confirmPassword
    ) {
      this.feedbackMessage = 'Les mots de passe ne correspondent pas!';
      return;
    }

    this.isLoading = true;
    this.feedbackMessage = '';

    const { email, password } = this.clientRegisterForm.value;
    const result = await this.supabaseService.signUp(email, password);

    if (result.success) {
      this.feedbackMessage = 'Check your email for verification!';
      setTimeout(() => {
        this.router.navigate(['/client-login']);
      }, 2000);
    } else {
      this.feedbackMessage = result.error || 'Sign up failed';
    }

    this.isLoading = false;
  }
}
