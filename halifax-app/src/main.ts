import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { enableProdMode, importProvidersFrom } from "@angular/core";
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientModule)],
}).catch((err) => console.error(err));
