import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Footer } from '../../../shared/layout/footer/footer';

@Component({
  selector: 'app-home',
  imports: [IonContent, Footer],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

}
