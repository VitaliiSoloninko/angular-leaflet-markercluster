import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-packet-header',
  templateUrl: './packet-header.component.html',
  styleUrl: './packet-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacketHeaderComponent {}
