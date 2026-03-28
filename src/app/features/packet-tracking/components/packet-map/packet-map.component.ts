import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import { Subject, takeUntil } from 'rxjs';
import { Packet } from '../../../../core/models/packet.interface';
import { PacketService } from '../../../../core/services/packet.service';
import { PacketHeaderComponent } from '../packet-header/packet-header.component';
import { PacketInfoBarComponent } from '../packet-info-bar/packet-info-bar.component';

@Component({
  selector: 'app-packet-map',
  imports: [PacketInfoBarComponent, PacketHeaderComponent],
  templateUrl: './packet-map.component.html',
  styleUrl: './packet-map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacketMapComponent implements AfterViewInit, OnDestroy {
  private readonly packetService = inject(PacketService);

  private map!: L.Map;
  private markerCluster!: L.MarkerClusterGroup;
  private destroy$ = new Subject<void>();

  // Signals для реактивного состояния
  public loading = signal(true);
  public error = signal<string | null>(null);
  public packetsCount = signal(0);

  // Marker icons for different statuses
  private markerIcons = {
    pending: L.icon({
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    }),
    in_transit: L.icon({
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    }),
    delivered: L.icon({
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    }),
  };

  ngAfterViewInit(): void {
    this.initMap();
    this.loadPackets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initMap(): void {
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    // Center on Germany
    const center = L.latLng(51.1657, 10.4515);

    this.map = L.map('map', { center: center, zoom: 6, layers: [tiles] });

    this.markerCluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
    });
  }

  private loadPackets(): void {
    this.loading.set(true);
    this.error.set(null);

    this.packetService
      .getPackets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (packets: Packet[]) => {
          this.packetsCount.set(packets.length);
          this.addPacketsToMap(packets);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading packets:', error);
          this.error.set('Fehler beim Laden der Paketdaten');
          this.loading.set(false);
        },
      });
  }

  private addPacketsToMap(packets: Packet[]): void {
    // Clear existing markers
    this.markerCluster.clearLayers();

    packets.forEach((packet) => {
      const lat = parseFloat(packet.lat);
      const lng = parseFloat(packet.lng);

      // Skip invalid coordinates
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Invalid coordinates for packet ${packet.trackingNumber}`);
        return;
      }

      // Get the appropriate icon based on status
      const icon = this.markerIcons[packet.status] || this.markerIcons.in_transit;

      const marker = L.marker(new L.LatLng(lat, lng), {
        title: packet.trackingNumber,
        icon: icon,
      });

      // Create popup content with packet details
      const popupContent = this.createPopupContent(packet);
      marker.bindPopup(popupContent);

      this.markerCluster.addLayer(marker);
    });

    this.map.addLayer(this.markerCluster);

    // Fit map bounds to show all markers
    if (packets.length > 0) {
      const bounds = this.markerCluster.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }

  private createPopupContent(packet: Packet): string {
    const statusLabels = {
      pending: '⏳ Ausstehend',
      in_transit: '🚚 Unterwegs',
      delivered: '✅ Zugestellt',
    };

    const statusColors = {
      pending: '#FFA500',
      in_transit: '#2196F3',
      delivered: '#4CAF50',
    };

    const status = statusLabels[packet.status] || packet.status;
    const color = statusColors[packet.status] || '#999';
    const date = new Date(packet.createdAt).toLocaleDateString('de-DE');

    return `
      <div style="font-family: 'Montserrat', sans-serif; min-width: 200px;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #333;">
          📦 ${packet.trackingNumber}
        </h3>
        <div style="margin: 5px 0;">
          <strong>Status:</strong> 
          <span style="color: ${color}; font-weight: bold;">${status}</span>
        </div>
        <div style="margin: 5px 0;">
          <strong>Koordinaten:</strong> ${parseFloat(packet.lat).toFixed(4)}, ${parseFloat(packet.lng).toFixed(4)}
        </div>
        <div style="margin: 5px 0;">
          <strong>Erstellungsdatum:</strong> ${date}
        </div>
      </div>
    `;
  }
}
