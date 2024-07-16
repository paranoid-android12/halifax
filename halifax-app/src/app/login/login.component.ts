import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/authentication/auth.service';
import { LoginService } from '../services/authentication/login.service';
import { Title } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hide = true;
  password: any;
  router: any;
  errorMessage: string = '';
  isLoading = false;
  form: FormGroup;
  private subscriptions = new Subscription();

  constructor(private authService: AuthService, private loginService: LoginService, private titleService: Title, private formBuilder: FormBuilder, private routers: Router, private dataService: DataService) {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    // to dynamically remove the error messag ewhen the user types in something new
    this.titleService.setTitle('Login - 888 HARDWARE TRADING');
    const usernameSubscription = this.form.get('username')!.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
    const passwordSubscription = this.form.get('password')!.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
    this.subscriptions.add(usernameSubscription);
    this.subscriptions.add(passwordSubscription);
  }

  toggleVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.hide = !this.hide;
  }

  setTokenInCookie(token: string) {
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (60 * 60 * 1000));
    document.cookie = `token=${token}; ${expireDate}; path=/`
  }

  navigateBasedOnRole() {
    // let role = this.authService.getRole();
    // if (role === 'admin'){
    //   this.routers.navigate(['/admin/dashboard']);
    // } else {
    //   console.log("idk what to do")
    //   //this.routers.navigate(['/drive']);
    // }
  }

  onLogin() {
    // this.isLoading = true;
    // this.dataService.login(this.form, 'login').subscribe({
    //   next: (res: any) => {
    //     if(res.code !== 403){
    //       this.isLoading = false;
    //       this.setTokenInCookie(res.token);
    //       this.navigateBasedOnRole();  
    //       this.loginService.LoggedIn();
    //       //this.openDialog("Email or password is incorrect. Please try again.");
    //     }
    //     else {
    //       this.errorMessage = "Email or password is incorrect. Please try again.";
    //     }

    //   },
    //   error: (err) => {
    //     // // console.log('Login not successful:', err.message);
    //     this.errorMessage = "Error Logging in. Please try again.";
  
    //   }
    // });
    // this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
