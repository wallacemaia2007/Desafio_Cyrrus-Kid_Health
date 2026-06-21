import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_ITEMS } from '../../model/nav-items';
import {
  IonFooter,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  medkitOutline,
  homeOutline,
  peopleOutline,
  megaphoneOutline,
  shieldCheckmarkOutline,
  calendarOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
    IonFooter,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonText,
    IonList,
    IonItem,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly currentYear = signal(new Date().getFullYear());
  protected readonly appVersion = signal('1.0.0');
  protected readonly appName = signal('Kid Health');
  protected readonly appDescription = signal(
    'Facilitando o acompanhamento da vacinação infantil de forma simples e segura.',
  );
  protected readonly navigationLinks = NAV_ITEMS;

  constructor() {
    addIcons({
      medkitOutline,
      homeOutline,
      peopleOutline,
      megaphoneOutline,
      shieldCheckmarkOutline,
      calendarOutline,
    });
  }
}
