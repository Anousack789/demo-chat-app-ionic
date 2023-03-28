import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { debounceTime } from 'rxjs';
import { DeviceService } from './services/device.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(platform: Platform, private deviceService: DeviceService) {
    platform.ready().then(() => {
      this.deviceService.width = platform.width();
      this.deviceService.height = platform.height();
      this.deviceService.isReady = true;
    });

    platform.resize.pipe(debounceTime(200)).subscribe(() => {
      this.deviceService.width = platform.width();
      this.deviceService.height = platform.height();
    });
  }
}
