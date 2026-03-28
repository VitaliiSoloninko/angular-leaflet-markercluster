export interface Packet {
  id: number;
  trackingNumber: string;
  lat: string;
  lng: string;
  status: 'pending' | 'in_transit' | 'delivered';
  createdAt: string;
  updatedAt: string;
}
