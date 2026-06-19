import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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

interface FooterLink {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
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
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly currentYear = signal(new Date().getFullYear());
  protected readonly appVersion = signal('1.0.0');
  protected readonly appName = signal('Kid Health');
  protected readonly appDescription = signal(
    'Facilitando o acompanhamento da vacinação infantil de forma simples e segura.'
  );

  protected readonly navigationLinks: FooterLink[] = [
    { label: 'Início', route: '/', icon: 'home-outline' },
    { label: 'Crianças', route: '/children', icon: 'people-outline' },
    { label: 'Campanhas', route: '/campaigns', icon: 'megaphone-outline' },
    { label: 'Campanhas Ativas', route: '/campaigns', icon: 'megaphone-outline' },
  ];

  protected trackByIndex(index: number): number {
    return index;
  }

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
