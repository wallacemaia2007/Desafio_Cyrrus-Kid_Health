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
import { Child, ChildVaccineItem } from '../../shared/model/child';
import { convertDates, convertToTimestamps } from '../../shared/utils/firestore-converters';

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private firestore = inject(Firestore);
  private childrenCollection = collection(this.firestore, 'children');

  private convertChild(data: any): Child {
    const child = convertDates<Child>(data, ['birthDate']);
    if (child.vaccines) {
      child.vaccines = child.vaccines.map((v) =>
        convertDates<ChildVaccineItem>(v, ['scheduledDate', 'applicationDate']),
      );
    }
    return child;
  }

  getChildren(): Observable<Child[]> {
    return new Observable<Child[]>((subscriber) => {
      const unsub: Unsubscribe = onSnapshot(
        this.childrenCollection,
        (snapshot) => {
          const children = snapshot.docs.map((d) =>
            this.convertChild({ id: d.id, ...d.data() }),
          );
          subscriber.next(children);
        },
        (err) => subscriber.error(err),
      );
      return { unsubscribe: () => unsub() };
    }).pipe(
      catchError((err) => {
        console.error('Erro ao carregar crianças do Firestore:', err);
        return of([]);
      }),
    );
  }

  getChildById(id: string): Observable<Child> {
    const ref = doc(this.firestore, 'children', id);
    return new Observable<Child>((subscriber) => {
      const unsub: Unsubscribe = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            const data = this.convertChild({ id: snap.id, ...snap.data() });
            subscriber.next(data);
          }
        },
        (err) => subscriber.error(err),
      );
      return { unsubscribe: () => unsub() };
    });
  }

  addChild(child: Omit<Child, 'id'>) {
    return addDoc(this.childrenCollection, convertToTimestamps<Child>(child, ['birthDate']));
  }

  updateChild(id: string, child: Partial<Child>) {
    const ref = doc(this.firestore, 'children', id);
    return updateDoc(ref, convertToTimestamps<Child>(child, ['birthDate']));
  }

  deleteChild(id: string) {
    const ref = doc(this.firestore, 'children', id);
    return deleteDoc(ref);
  }

  searchChildren(term: string): Observable<Child[]> {
    return this.getChildren().pipe(
      map((children) =>
        children.filter((child) => child.name.toLowerCase().includes(term.toLowerCase())),
      ),
    );
  }
}
