import { AfterViewInit, Component } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import addressPoints from './locations.json';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  private map!: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ',
    });

    const center = L.latLng(-37.82, 175.24);

    this.map = L.map('map', { center: center, zoom: 13, layers: [tiles] });

    const markerIcon = L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      iconUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png',
    });

    const markerCluster = L.markerClusterGroup();

    for (let i = 0; i < addressPoints.length; i++) {
      const title = addressPoints[i][2] as string;
      const lat = addressPoints[i][0] as number;
      const lng = addressPoints[i][1] as number;
      const marker = L.marker(new L.LatLng(lat, lng), { title: title, icon: markerIcon });
      marker.bindPopup(title);
      markerCluster.addLayer(marker);
    }

    this.map.addLayer(markerCluster);
  }
}
