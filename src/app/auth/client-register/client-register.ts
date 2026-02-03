import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-register.html',
})
export class ClientRegisterComponent {
  clientRegisterForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.clientRegisterForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  submit() {
    if (this.clientRegisterForm.invalid) return;

    // مثال: validation dyal passwords match
    if (this.clientRegisterForm.value.password !== this.clientRegisterForm.value.confirmPassword) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }

    console.log('CLIENT REGISTER', this.clientRegisterForm.value);

    // بعد تسجيل ناجح → redirect لل home
    this.router.navigate(['/']);
  }
}
