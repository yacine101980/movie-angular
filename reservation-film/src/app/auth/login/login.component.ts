import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  login(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.error = null;

  const { email, password } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: (users) => {
      this.loading = false;
      if (users.length > 0) {
        const user = users[0];
        this.authService.setCurrentUser(user); // ✅ Sauvegarde du user
        this.router.navigate(['/']); // ✅ Redirection après connexion
      } else {
        this.error = 'Adresse e-mail ou mot de passe incorrect';
      }
    },
    error: (err) => {
      console.error('Erreur de connexion:', err);
      this.loading = false;
      this.error = 'Une erreur est survenue. Veuillez réessayer.';
    }
  });
}

  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
