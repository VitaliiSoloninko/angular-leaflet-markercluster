import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-packet-info-bar',
  templateUrl: './packet-info-bar.component.html',
  styleUrl: './packet-info-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacketInfoBarComponent {
  packetsCount = input.required<number>();
}
