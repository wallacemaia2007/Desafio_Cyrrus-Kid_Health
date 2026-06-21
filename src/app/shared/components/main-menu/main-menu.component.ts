import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { NAV_ITEMS } from '../../model/nav-items';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IonMenu,
    IonContent,
    IonList,
    IonItem,
    IonMenuToggle,
  ],
  template: `
    <ion-menu side="end" menuId="main-menu" contentId="main-content">
      <ion-content>
        <div class="p-6">
          <h2 class="text-lg font-bold text-dark">Kid Health</h2>
        </div>

        <ion-list>
          @for (item of navItems; track item.route) {
            <ion-menu-toggle auto-hide="true">
              <ion-item
                [routerLink]="item.route"
                routerLinkActive="text-primary bg-primary/10"
                [routerLinkActiveOptions]="{ exact: item.route === '/' }"
                lines="none"
              >
                {{ item.label }}
              </ion-item>
            </ion-menu-toggle>
          }
        </ion-list>
      </ion-content>
    </ion-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent {
  protected readonly navItems = NAV_ITEMS;
}
