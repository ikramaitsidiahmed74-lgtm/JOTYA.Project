import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendeur-boutique',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendeur-boutique.html'
})
export class VendeurBoutiqueComponent {
  form: FormGroup;
  logoPreview: string | null = null;
  coverPreview: string | null = null;
  logoFile!: File;
  coverFile!: File;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      nomBoutique: ['', Validators.required],
      ville: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onLogoUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.logoFile = file;
    this.logoPreview = URL.createObjectURL(file);
  }

  onCoverUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.coverFile = file;
    this.coverPreview = URL.createObjectURL(file);
  }

  next() {
    if (this.form.invalid || !this.logoFile || !this.coverFile) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    console.log('BOUTIQUE', this.form.value);
    this.router.navigate(['/auth/vendeur-certification']);
  }
}
