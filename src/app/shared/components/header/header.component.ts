import { Component, ChangeDetectionStrategy, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  MenuController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, closeOutline } from 'ionicons/icons';
import { NAV_ITEMS } from '../../model/nav-items';
import { ScrollHideDirective } from '../../../core/directive/scroll-hide.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    ScrollHideDirective,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly menuCtrl = inject(MenuController);

  public readonly isMenuOpen = signal<boolean>(false);
  public readonly navLinks = NAV_ITEMS;

  constructor() {
    addIcons({ menuOutline, closeOutline });
  }

  @HostListener('window:main-menu-state-change', ['$event'])
  protected onMainMenuStateChange(event: Event): void {
    const { isOpen } = (event as CustomEvent<{ isOpen: boolean }>).detail;
    this.isMenuOpen.set(isOpen);
  }

  public async toggleMenu(): Promise<void> {
    const isOpen = await this.menuCtrl.isOpen('main-menu');
    if (isOpen) {
      await this.menuCtrl.close('main-menu');
      this.isMenuOpen.set(false);
    } else {
      await this.menuCtrl.open('main-menu');
      this.isMenuOpen.set(true);
    }
  }

  public async closeMenu(): Promise<void> {
    await this.menuCtrl.close('main-menu');
    this.isMenuOpen.set(false);
  }

  public scrollTo(event: Event, targetId: string): void {
    event.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
    this.closeMenu();
  }
}
