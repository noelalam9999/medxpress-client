/**
 * This component represents the login page for customers.
 * It contains a form for customers to enter their email and password to log in.
 * If the login is successful, it saves the access token and navigates to the home page.
 * If the login fails, it displays an error message.
 */

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerServicesService } from '../../services/customer-services.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  private toastService = inject(HotToastService);

  constructor(
    private router: Router,
    private customerService: CustomerServicesService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Checks if a form field is invalid based on its name.
   * @param fieldName The name of the form field to check.
   * @returns True if the field is invalid and has been touched or modified, false otherwise.
   */
  isFieldInvalid(fieldName: string): boolean {
    const fieldControl = this.loginForm.get(fieldName);
    if (fieldControl) {
      return (
        fieldControl.invalid && (fieldControl.dirty || fieldControl.touched)
      );
    }
    return false;
  }

  /**
   * Handles the click event of the login button.
   * If the login form is valid, it sends a request to the server to log in the customer.
   * If the login is successful, it saves the access token and navigates to the home page.
   * If the login fails, it displays an error message.
   */
  handleLoginClick(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.customerService.loginCustomer(loginData).subscribe({
        next: (data) => {
          this.customerService.saveAccessToken(
            data.access_token,
            data.expires_in
          );
          this.toastService.success('Login Successful', {
            icon: '😀',
            position: 'top-center',
            duration: 2000,
            style: {
              border: '1px solid #067A46',
              padding: '16px',
              color: '#067A46',
              background: '#D2F895',
              fontFamily: 'Agrandir-Regular',
            },
          });
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error(error);
          this.toastService.error('Login failed', {
            icon: '😞',
            position: 'top-center',
            duration: 2000,
            style: {
              border: '1px solid #FF0000',
              padding: '16px',
              color: '#FF0000',
              background: '#FFB0B0',
              fontFamily: 'Agrandir-Regular',
            },
          });
        },
      });
    }
  }
}
