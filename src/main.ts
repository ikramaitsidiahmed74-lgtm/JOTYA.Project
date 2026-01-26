import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
// import { DashBord } from './app/dash-bord/dash-bord';
// import { Footer } from './app/footer/footer';


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

