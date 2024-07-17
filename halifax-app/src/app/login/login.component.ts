declare var google:any;
import { Component } from '@angular/core';
import { Subscription, throttleTime } from 'rxjs';
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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { TokenService } from '../services/authentication/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, MatProgressSpinnerModule],
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
  isSignInActive: boolean = true;
  googleLogin: boolean = false;

  constructor(private loginService: LoginService, private authService: AuthService, private tokenService: TokenService, private titleService: Title, private formBuilder: FormBuilder, private routers: Router, private dataService: DataService) {
    this.tokenService.flushToken();
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      username: new FormControl('')
    });
  }

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '29716397471-rli2g9ckpmqqg94h4vniv7jrd7akos34.apps.googleusercontent.com',
      callback: (response: any) => {
        //decode the credential
        let decodedToken = this.tokenService.decode(response.credential);
        let userEmail = this.tokenService.userGoogleEmailToken(decodedToken);
        let userName = this.tokenService.userGoogleNameToken(decodedToken);
        //take the email and set it to the form
        this.form.get('email')!.setValue(userEmail);
        this.form.get('username')!.setValue(userName);
        this.form.get('password')!.setValue(userName);
        this.googleLogin = true;
        this.onLogin();

      }
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'outline',
      size: 'large',
      text: 'Continue with Google',
      shape: 'rectangular',
      width: '500',
      height: '100',
    });

    this.titleService.setTitle('Halifax - Everything In One Place');
    const usernameSubscription = this.form.get('username')!.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
    const passwordSubscription = this.form.get('password')!.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
    this.subscriptions.add(usernameSubscription);
    this.subscriptions.add(passwordSubscription);
  }


  toggleForm() {
    this.isSignInActive = !this.isSignInActive;
  }


  toggleVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.hide = !this.hide;
  }

  setTokenInCookie(token: string) {
    console.log("setting token in cookie ", token);
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (60 * 60 * 1000));
    document.cookie = `token=${token}; ${expireDate}; path=/`
  }

  navigateBasedOnRole() {
    console.log("navigate to user page");
    this.routers.navigate(['/browse']);
  }

  onLogin() {
    this.isLoading = true;
    let endpoint = 'registerUser';
    if(this.isSignInActive) {
      endpoint = 'login';
    } 

    if(this.googleLogin) {
      endpoint = 'google-login';
    }

    console.log(this.form.value);
    this.dataService.login(this.form, endpoint).subscribe({
      next: (next:any) => {
        console.log(next);
        if(next.code === 200){
          this.setTokenInCookie(next.token);
          this.loginService.LoggedIn();
          this.routers.navigate(['/browse']);
        } else {
          if(next.message === "User already exists") {

            this.errorMessage = "User already exists. Please login.";
          } else if (next.message === "User not found") {

            this.errorMessage = "User not found. Please register.";
          } else {
            this.errorMessage = next.message;
          }
        }
      },

    })

    this.googleLogin = false;

    console.log("this was the endpoint", endpoint);

    // this.dataService.login(this.form, endpoint).subscribe({
    //   next: (res: any) => {
    //     if(res.code !== 403){
    //       this.isLoading = false;
    //       this.setTokenInCookie(res.token);
    //       this.navigateBasedOnRole();  
    //       this.loginService.LoggedIn();
    //     }
    //     else {
    //       this.errorMessage = "Email or password is incorrect. Please try again.";
    //     }

    //   },
    //   error: (err) => {
    //     this.errorMessage = "Error Logging in. Please try again.";
  
    //   }
    // });
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
