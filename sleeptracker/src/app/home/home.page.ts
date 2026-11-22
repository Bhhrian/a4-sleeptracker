import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText
} from '@ionic/angular/standalone';

import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonText
  ]
})
export class HomePage {

  bedtime: string = '';
  wakeTime: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(public sleepService: SleepService) {}

  get overnightLogs(): OvernightSleepData[] {
    return SleepService.AllOvernightData;
  }

  saveSleep(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.bedtime || !this.wakeTime) {
      this.errorMessage = 'Please enter both times.';
      return;
    }

    const start = new Date(this.bedtime);
    const end = new Date(this.wakeTime);

    if (
      !Number.isFinite(start.getTime()) ||
      !Number.isFinite(end.getTime())
    ) {
      this.errorMessage = 'Please enter valid dates and times.';
      return;
    }

    if (end <= start) {
      this.errorMessage =
        'Wake-up time must be after bedtime.';
      return;
    }

    const durationHours =
      (end.getTime() - start.getTime()) / 3600000;

    if (durationHours > 24) {
      this.errorMessage =
        'Sleep duration cannot exceed 24 hours.';
      return;
    }

    const sleepLog = new OvernightSleepData(start, end);

    this.sleepService.logOvernightData(sleepLog);

    this.successMessage = 'Sleep recorded successfully!';

    this.bedtime = '';
    this.wakeTime = '';
  }
}
