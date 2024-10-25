import { Component, inject } from '@angular/core';

import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mtb';

  private readonly _messaging = inject(Messaging);

  ngOnInit(): void {
    this._getDeviceToken();
    this._onMessage();
  }

  private _getDeviceToken(): void {
    getToken(this._messaging, { vapidKey: environment.vapidKey })
      .then((token) => {
      })
      .catch((error) => console.log('Token error', error));
  }

  private _onMessage(): void {
    onMessage(this._messaging, {
      next: (payload) => console.log('Message', payload),
      error: (error) => console.log('Message error', error),
      complete: () => console.log('Done listening to messages'),
    });
  }
}
