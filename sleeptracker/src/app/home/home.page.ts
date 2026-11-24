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
  IonText,
  IonSelect,
  IonSelectOption,
  AlertController
} from '@ionic/angular/standalone';

import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LocalNotifications } from '@capacitor/local-notifications';

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
    IonText,
    IonSelect,
    IonSelectOption
  ]
})
export class HomePage {

  // Overnight sleep logging
  bedtime: string = '';
  wakeTime: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  // Daytime sleepiness logging
  sleepinessLevel: number | null = null;
  sleepinessError: string = '';
  sleepinessSuccess: string = '';

  // Sleepiness reminder
  reminderMinutes: number = 30;
  reminderSuccess: string = '';

  readonly sleepinessScale = StanfordSleepinessData.ScaleValues;

  constructor(
    public sleepService: SleepService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await LocalNotifications.requestPermissions();
  }

  get overnightLogs(): OvernightSleepData[] {
    return SleepService.AllOvernightData;
  }

  get sleepinessLogs(): StanfordSleepinessData[] {
    return SleepService.AllSleepinessData;
  }

  // Dashboard: total overnight sleep records
  get totalSleepLogs(): number {
    return this.overnightLogs.length;
  }

  // Dashboard: average sleep duration in hours
  get averageSleepHours(): string {
    if (this.overnightLogs.length === 0) {
      return '0.0';
    }

    let totalHours = 0;

    for (const log of this.overnightLogs) {
      const record = log as unknown as {
        sleepStart: Date;
        sleepEnd: Date;
      };

      const duration =
        (record.sleepEnd.getTime() -
          record.sleepStart.getTime()) / 3600000;

      totalHours += duration;
    }

    return (totalHours / this.overnightLogs.length).toFixed(1);
  }

  // Dashboard: average Stanford Sleepiness Scale score
  get averageSleepiness(): string {
    if (this.sleepinessLogs.length === 0) {
      return '0.0';
    }

    let total = 0;

    for (const log of this.sleepinessLogs) {
      const record = log as unknown as {
        loggedValue: number;
      };

      total += record.loggedValue;
    }

    return (total / this.sleepinessLogs.length).toFixed(1);
  }

  // Save overnight sleep data
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

  // Save Stanford Sleepiness Scale data
  saveSleepiness(): void {
    this.sleepinessError = '';
    this.sleepinessSuccess = '';

    const level = Number(this.sleepinessLevel);

    if (
      this.sleepinessLevel === null ||
      !Number.isInteger(level) ||
      level < 1 ||
      level > 7
    ) {
      this.sleepinessError =
        'Please select a sleepiness level from 1 to 7.';
      return;
    }

    const log = new StanfordSleepinessData(
      level,
      new Date()
    );

    this.sleepService.logSleepinessData(log);

    this.sleepinessSuccess =
      'Sleepiness recorded successfully!';

    this.sleepinessLevel = null;
  }

  // Confirm deletion of an overnight sleep record
  async confirmDeleteOvernight(index: number): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Sleep Record?',
      message: 'This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.sleepService.deleteOvernightData(index);
            this.successMessage = '';
          }
        }
      ]
    });

    await alert.present();
  }

  // Confirm deletion of a daytime sleepiness record
  async confirmDeleteSleepiness(index: number): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Sleepiness Record?',
      message: 'This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.sleepService.deleteSleepinessData(index);
            this.sleepinessSuccess = '';
          }
        }
      ]
    });

    await alert.present();
  }

  async setReminder() {
    this.reminderSuccess = '';
    await LocalNotifications.schedule({
        notifications: [
            {
                title: "Sleepiness Reminder",
                body: "Don't forget to log your daytime sleepiness!",
                id: 1,
                schedule: {
                    at: new Date(Date.now() + 1000 * 60 * this.reminderMinutes)
                }
            }
        ]
    });

    this.reminderSuccess = 'Reminder set successfully!';
  }
}
