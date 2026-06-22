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
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, map, catchError, of } from 'rxjs';
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

  private snapshotToApplication(snap: any): VaccineApplication {
    return this.convertFrom({ id: snap.id, ...snap.data() });
  }

  getApplications(): Observable<VaccineApplication[]> {
    return new Observable<VaccineApplication[]>((subscriber) => {
      const unsub: Unsubscribe = onSnapshot(
        this.applicationsCollection,
        (snapshot) => {
          subscriber.next(snapshot.docs.map((d) => this.snapshotToApplication(d)));
        },
        (err) => subscriber.error(err),
      );
      return { unsubscribe: () => unsub() };
    }).pipe(
      catchError((err) => {
        console.error('Erro ao carregar aplicações do Firestore:', err);
        return of([]);
      }),
    );
  }

  getApplicationById(id: string): Observable<VaccineApplication> {
    const ref = doc(this.firestore, 'vaccine-applications', id);
    return new Observable<VaccineApplication>((subscriber) => {
      const unsub: Unsubscribe = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            subscriber.next(this.snapshotToApplication(snap));
          }
        },
        (err) => subscriber.error(err),
      );
      return { unsubscribe: () => unsub() };
    });
  }

  getApplicationsByChildId(childId: string): Observable<VaccineApplication[]> {
    return new Observable<VaccineApplication[]>((subscriber) => {
      const q = query(this.applicationsCollection, where('childId', '==', childId));
      const unsub: Unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          subscriber.next(snapshot.docs.map((d) => this.snapshotToApplication(d)));
        },
        (err) => subscriber.error(err),
      );
      return { unsubscribe: () => unsub() };
    }).pipe(
      catchError((err) => {
        console.error('Erro ao carregar aplicações da criança:', err);
        return of([]);
      }),
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
