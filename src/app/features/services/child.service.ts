import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Child } from '../../shared/model/child';

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private childrenSubject = new BehaviorSubject<Child[]>([
    {
      id: '1',
      name: 'Enzo Gabriel',
      birthDate: new Date(2020, 5, 15),
      totalVaccines: 12,
      appliedVaccines: 10,
      pendingVaccines: 2,
    },
    {
      id: '2',
      name: 'Valentina Silva',
      birthDate: new Date(2021, 2, 10),
      totalVaccines: 10,
      appliedVaccines: 10,
      pendingVaccines: 0,
    },
    {
      id: '3',
      name: 'Miguel Oliveira',
      birthDate: new Date(2019, 10, 22),
      totalVaccines: 15,
      appliedVaccines: 12,
      pendingVaccines: 3,
    },
    {
      id: '4',
      name: 'Alice Santos',
      birthDate: new Date(2022, 0, 5),
      totalVaccines: 8,
      appliedVaccines: 5,
      pendingVaccines: 3,
    },
  ]);

  getChildren(): Observable<Child[]> {
    return this.childrenSubject.asObservable();
  }

  searchChildren(term: string): Observable<Child[]> {
    return this.getChildren().pipe(
      map((children) =>
        children.filter((child) => child.name.toLowerCase().includes(term.toLowerCase())),
      ),
    );
  }
}
