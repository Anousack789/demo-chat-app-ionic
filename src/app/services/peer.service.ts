import { Injectable } from '@angular/core';
import { Peer } from 'peerjs';
@Injectable({
  providedIn: 'root',
})
export class PeerService {
  peer: any;
  anotherid: any;
  mypeerid: any;
  constructor() {
    this.peer = new Peer({
      host: 'http://localhost',
      port: 9000,
      token: '12345',
    });
    this.peer.on('open', (id: any) => {
      console.log('My peer ID is: ' + id);
      this.mypeerid = id;
    });
  }

  connect(id: string) {
    const conn = this.peer.connect(this.anotherid);
    conn.on('open', () => {
      conn.send('hi!');
    });
  }
}
