import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Packet } from '../models/packet.interface';

@Injectable({
  providedIn: 'root',
})
export class PacketService {
  private apiUrl = `${environment.apiUrl}/packets`;

  constructor(private http: HttpClient) {}

  /**
   * Get all packets from the backend
   * @returns Observable<Packet[]>
   */
  getPackets(): Observable<Packet[]> {
    return this.http.get<Packet[]>(this.apiUrl);
  }

  /**
   * Get packets filtered by date range
   * @param startDate - Start date in format YYYY-MM-DD
   * @param endDate - End date in format YYYY-MM-DD
   * @returns Observable<Packet[]>
   */
  getPacketsByDateRange(startDate: string, endDate: string): Observable<Packet[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);

    return this.http.get<Packet[]>(this.apiUrl, { params });
  }
}
