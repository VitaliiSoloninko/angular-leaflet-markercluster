import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PACKETS_URL } from '../constants/urls';
import { Packet } from '../models/packet.interface';

@Injectable({
  providedIn: 'root',
})
export class PacketService {
  private readonly http = inject(HttpClient);

  getPackets(): Observable<Packet[]> {
    return this.http.get<Packet[]>(PACKETS_URL);
  }

  getPacketsByDateRange(startDate: string, endDate: string): Observable<Packet[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<Packet[]>(PACKETS_URL, { params });
  }
}
