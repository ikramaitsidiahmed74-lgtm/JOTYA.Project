import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-vendeur-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './vendeur-login.html'
})
export class VendeurLoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submitVendeurLogin() {
    if (this.form.invalid) return;
    console.log('VENDEUR LOGIN', this.form.value);
  }

  goRegister() {
    this.router.navigate(['/auth/vendeur-register']);
  }
}
