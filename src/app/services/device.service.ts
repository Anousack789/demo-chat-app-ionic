import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  isReady: boolean = false;
  width: number = 0;
  height: number = 0;
}
