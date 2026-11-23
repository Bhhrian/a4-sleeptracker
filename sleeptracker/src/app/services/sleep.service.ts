import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

interface StoredOvernightSleep {
  sleepStart: string;
  sleepEnd: string;
}

interface StoredSleepiness {
  loggedValue: number;
  loggedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class SleepService {
  private static LoadDefaultData = true;

  private readonly overnightStorageKey = 'sleeptracker_overnight';
  private readonly sleepinessStorageKey = 'sleeptracker_sleepiness';

  public static AllSleepData: SleepData[] = [];
  public static AllOvernightData: OvernightSleepData[] = [];
  public static AllSleepinessData: StanfordSleepinessData[] = [];

  constructor() {
    if (SleepService.LoadDefaultData) {
      SleepService.LoadDefaultData = false;
      this.loadSavedData();
    }
  }

  private loadSavedData(): void {
    try {
      const overnightJSON = localStorage.getItem(
        this.overnightStorageKey
      );

      const sleepinessJSON = localStorage.getItem(
        this.sleepinessStorageKey
      );

      if (overnightJSON) {
        const savedOvernight: StoredOvernightSleep[] =
          JSON.parse(overnightJSON);

        for (const entry of savedOvernight) {
          const start = new Date(entry.sleepStart);
          const end = new Date(entry.sleepEnd);

          if (
            Number.isFinite(start.getTime()) &&
            Number.isFinite(end.getTime()) &&
            end > start
          ) {
            const log = new OvernightSleepData(start, end);

            SleepService.AllOvernightData.push(log);
            SleepService.AllSleepData.push(log);
          }
        }
      }

      if (sleepinessJSON) {
        const savedSleepiness: StoredSleepiness[] =
          JSON.parse(sleepinessJSON);

        for (const entry of savedSleepiness) {
          const date = new Date(entry.loggedAt);

          if (
            Number.isInteger(entry.loggedValue) &&
            entry.loggedValue >= 1 &&
            entry.loggedValue <= 7 &&
            Number.isFinite(date.getTime())
          ) {
            const log = new StanfordSleepinessData(
              entry.loggedValue,
              date
            );

            SleepService.AllSleepinessData.push(log);
            SleepService.AllSleepData.push(log);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load saved sleep data:', error);
    }
  }

  private saveOvernightData(): void {
    try {
      const data: StoredOvernightSleep[] =
        SleepService.AllOvernightData.map(log => {
          const raw = log as unknown as {
            sleepStart: Date;
            sleepEnd: Date;
          };

          return {
            sleepStart: raw.sleepStart.toISOString(),
            sleepEnd: raw.sleepEnd.toISOString()
          };
        });

      localStorage.setItem(
        this.overnightStorageKey,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Failed to save overnight data:', error);
    }
  }

  private saveSleepinessData(): void {
    try {
      const data: StoredSleepiness[] =
        SleepService.AllSleepinessData.map(log => {
          const raw = log as unknown as {
            loggedValue: number;
            loggedAt: Date;
          };

          return {
            loggedValue: raw.loggedValue,
            loggedAt: raw.loggedAt.toISOString()
          };
        });

      localStorage.setItem(
        this.sleepinessStorageKey,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Failed to save sleepiness data:', error);
    }
  }

  public logOvernightData(sleepData: OvernightSleepData): void {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllOvernightData.push(sleepData);

    this.saveOvernightData();
  }

  public logSleepinessData(sleepData: StanfordSleepinessData): void {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllSleepinessData.push(sleepData);

    this.saveSleepinessData();
  }

  public deleteOvernightData(index: number): void {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= SleepService.AllOvernightData.length
    ) {
      return;
    }

    const log = SleepService.AllOvernightData[index];

    SleepService.AllOvernightData.splice(index, 1);

    const allIndex = SleepService.AllSleepData.indexOf(log);

    if (allIndex !== -1) {
      SleepService.AllSleepData.splice(allIndex, 1);
    }

    this.saveOvernightData();
  }

  public deleteSleepinessData(index: number): void {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= SleepService.AllSleepinessData.length
    ) {
      return;
    }

    const log = SleepService.AllSleepinessData[index];

    SleepService.AllSleepinessData.splice(index, 1);

    const allIndex = SleepService.AllSleepData.indexOf(log);

    if (allIndex !== -1) {
      SleepService.AllSleepData.splice(allIndex, 1);
    }

    this.saveSleepinessData();
  }
}
