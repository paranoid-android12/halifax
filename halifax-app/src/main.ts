import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from "@angular/common/http";
import { enableProdMode, importProvidersFrom } from "@angular/core";
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));