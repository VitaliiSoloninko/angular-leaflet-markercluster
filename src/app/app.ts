import { Component } from '@angular/core';
import { PacketMapComponent } from './features/packet-tracking';

@Component({
  selector: 'app-root',
  imports: [PacketMapComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {}
