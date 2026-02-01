import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-vendeur-certification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './vendeur-certification.html'
})
export class VendeurCertificationComponent {
  form: FormGroup;
  idRectoPreview: string | null = null;
  idVersoPreview: string | null = null;
  idRectoFile!: File;
  idVersoFile!: File;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      siret: ['', Validators.required],
      accepted: [false, Validators.requiredTrue]
    });
  }

  onIdRectoUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.idRectoFile = file;
    this.idRectoPreview = URL.createObjectURL(file);
  }

  onIdVersoUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.idVersoFile = file;
    this.idVersoPreview = URL.createObjectURL(file);
  }

  submitAll() {
    if (this.form.invalid || !this.idRectoFile || !this.idVersoFile) {
      alert('Veuillez compléter la certification');
      return;
    }

    console.log('CERTIFICATION', this.form.value);
  }
}
