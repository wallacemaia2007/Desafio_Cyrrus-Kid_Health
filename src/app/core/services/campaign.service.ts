import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from '@angular/fire/firestore';
import { Observable, map, catchError, of } from 'rxjs';
import { Campaign } from '../../shared/model/campaign';
import { convertDates, convertToTimestamps } from '../../shared/utils/firestore-converters';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private firestore = inject(Firestore);
  private campaignsCollection = collection(this.firestore, 'campaigns');

  getCampaigns(): Observable<Campaign[]> {
    return new Observable<Campaign[]>((subscriber) => {
      const unsub: Unsubscribe = onSnapshot(
        this.campaignsCollection,
        (snapshot) => {
          const campaigns = snapshot.docs.map((d) =>
            convertDates<Campaign>({ id: d.id, ...d.data() }, ['startDate', 'endDate']),
          );
          subscriber.next(campaigns);
        },
        (err) => subscriber.error(err),
      );
      return { unsubscribe: () => unsub() };
    }).pipe(
      catchError((err) => {
        console.error('Erro ao carregar campanhas do Firestore:', err);
        return of([]);
      }),
    );
  }

  getCampaignById(id: string): Observable<Campaign> {
    const ref = doc(this.firestore, 'campaigns', id);
    return new Observable<Campaign>((subscriber) => {
      const unsub: Unsubscribe = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            const data = convertDates<Campaign>({ id: snap.id, ...snap.data() }, ['startDate', 'endDate']);
            subscriber.next(data);
          }
        },
        (err) => subscriber.error(err),
      );
      return { unsubscribe: () => unsub() };
    });
  }

  addCampaign(campaign: Omit<Campaign, 'id'>) {
    return addDoc(
      this.campaignsCollection,
      convertToTimestamps<Campaign>(campaign, ['startDate', 'endDate']),
    );
  }

  updateCampaign(id: string, campaign: Partial<Campaign>) {
    const ref = doc(this.firestore, 'campaigns', id);
    return updateDoc(
      ref,
      convertToTimestamps<Campaign>(campaign, ['startDate', 'endDate']),
    );
  }

  deleteCampaign(id: string) {
    const ref = doc(this.firestore, 'campaigns', id);
    return deleteDoc(ref);
  }
}
