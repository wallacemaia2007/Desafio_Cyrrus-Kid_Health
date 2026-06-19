import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-children-list',
  imports: [IonContent],
  templateUrl: './children-list.component.html',
  styleUrl: './children-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenListComponent {

}
