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
import { Observable, catchError, of } from 'rxjs';
import { Vaccine } from '../../shared/model/vaccine';

@Injectable({
  providedIn: 'root',
})
export class VaccineService {
  private firestore = inject(Firestore);
  private vaccinesCollection = collection(this.firestore, 'vaccines');

  getVaccines(): Observable<Vaccine[]> {
    return new Observable<Vaccine[]>((subscriber) => {
      const unsub: Unsubscribe = onSnapshot(
        this.vaccinesCollection,
        (snapshot) => {
          const vaccines = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Vaccine);
          subscriber.next(vaccines);
        },
        (err) => subscriber.error(err),
      );
      return { unsubscribe: () => unsub() };
    }).pipe(
      catchError((err) => {
        console.error('Erro ao carregar vacinas do Firestore:', err);
        return of([]);
      }),
    );
  }

  getVaccineById(id: string): Observable<Vaccine> {
    const ref = doc(this.firestore, 'vaccines', id);
    return new Observable<Vaccine>((subscriber) => {
      const unsub: Unsubscribe = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            subscriber.next({ id: snap.id, ...snap.data() } as Vaccine);
          }
        },
        (err) => subscriber.error(err),
      );
      return { unsubscribe: () => unsub() };
    });
  }

  addVaccine(vaccine: Omit<Vaccine, 'id'>) {
    return addDoc(this.vaccinesCollection, vaccine);
  }

  updateVaccine(id: string, vaccine: Partial<Vaccine>) {
    const ref = doc(this.firestore, 'vaccines', id);
    return updateDoc(ref, vaccine);
  }

  deleteVaccine(id: string) {
    const ref = doc(this.firestore, 'vaccines', id);
    return deleteDoc(ref);
  }
}
