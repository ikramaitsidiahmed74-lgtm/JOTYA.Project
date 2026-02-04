import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendeur-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendeur-profil.html'
})
export class VendeurProfilComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  next() {
    if (this.form.invalid) return;

    if (this.form.value.password !== this.form.value.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    console.log('PROFIL', this.form.value);
    this.router.navigate(['/auth/vendeur-boutique']);
  }
}
