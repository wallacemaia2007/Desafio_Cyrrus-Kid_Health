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
import { Observable } from 'rxjs';
import { Vaccine } from '../../shared/model/vaccine';

@Injectable({
  providedIn: 'root',
})
export class VaccineService {
  private firestore = inject(Firestore);
  private vaccinesCollection = collection(this.firestore, 'vaccines');

  getVaccines(): Observable<Vaccine[]> {
    return collectionData(this.vaccinesCollection, { idField: 'id' }) as Observable<Vaccine[]>;
  }

  getVaccineById(id: string): Observable<Vaccine> {
    const ref = doc(this.firestore, 'vaccines', id);
    return docData(ref, { idField: 'id' }) as Observable<Vaccine>;
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
