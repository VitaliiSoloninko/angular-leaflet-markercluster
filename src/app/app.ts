import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PacketMapComponent } from './features/packet-tracking/components/packet-map/packet-map.component';

@Component({
  selector: 'app-root',
  imports: [PacketMapComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
