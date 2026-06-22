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
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { VaccineApplication } from '../../shared/model/vaccineApplication';
import { convertDates, convertToTimestamps } from '../../shared/utils/firestore-converters';

@Injectable({
  providedIn: 'root',
})
export class VaccineApplicationService {
  private firestore = inject(Firestore);
  private applicationsCollection = collection(this.firestore, 'vaccine-applications');

  private convertFrom(d: any): VaccineApplication {
    return convertDates<VaccineApplication>(d, ['scheduledDate', 'applicationDate']);
  }

  getApplications(): Observable<VaccineApplication[]> {
    return collectionData(this.applicationsCollection, { idField: 'id' }).pipe(
      map((docs) => docs.map((d) => this.convertFrom(d))),
    );
  }

  getApplicationById(id: string): Observable<VaccineApplication> {
    const ref = doc(this.firestore, 'vaccine-applications', id);
    return docData(ref, { idField: 'id' }).pipe(map((d) => this.convertFrom(d)));
  }

  getApplicationsByChildId(childId: string): Observable<VaccineApplication[]> {
    const q = query(this.applicationsCollection, where('childId', '==', childId));
    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((d) => this.convertFrom(d))),
    );
  }

  addApplication(application: Omit<VaccineApplication, 'id'>) {
    return addDoc(
      this.applicationsCollection,
      convertToTimestamps<VaccineApplication>(application, ['scheduledDate', 'applicationDate']),
    );
  }

  updateApplication(id: string, application: Partial<VaccineApplication>) {
    const ref = doc(this.firestore, 'vaccine-applications', id);
    return updateDoc(
      ref,
      convertToTimestamps<VaccineApplication>(application, ['scheduledDate', 'applicationDate']),
    );
  }

  deleteApplication(id: string) {
    const ref = doc(this.firestore, 'vaccine-applications', id);
    return deleteDoc(ref);
  }
}
