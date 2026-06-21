import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  MenuController,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from './shared/layout/header/header.component';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-root',
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    RouterLink,
    HeaderComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly menuCtrl = inject(MenuController);
  protected readonly title = signal('kid_health');

  protected readonly navLinks: NavItem[] = [
    { label: 'Início', route: '/' },
    { label: 'Crianças', route: '/children' },
    { label: 'Campanhas', route: '/campaigns' },
  ];

  constructor() {
    addIcons({ closeOutline });
  }

  closeMobileMenu(): void {
    this.menuCtrl.close('main-menu');
  }
}
