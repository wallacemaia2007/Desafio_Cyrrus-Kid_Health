import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Campaign } from '../../shared/model/campaign';
import { convertDates, convertToTimestamps } from '../../shared/utils/firestore-converters';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private firestore = inject(Firestore);
  private campaignsCollection = collection(this.firestore, 'campaigns');

  getCampaigns(): Observable<Campaign[]> {
    return collectionData(this.campaignsCollection, { idField: 'id' }).pipe(
      map((docs) => docs.map((d) => convertDates<Campaign>(d, ['startDate', 'endDate']))),
    );
  }

  getCampaignById(id: string): Observable<Campaign> {
    const ref = doc(this.firestore, 'campaigns', id);
    return docData(ref, { idField: 'id' }).pipe(
      map((d) => convertDates<Campaign>(d, ['startDate', 'endDate'])),
    );
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
