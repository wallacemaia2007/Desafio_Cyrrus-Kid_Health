import { Component, ChangeDetectionStrategy, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  MenuController,
  Platform,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, closeOutline } from 'ionicons/icons';
import { NAV_ITEMS } from '../../model/nav-items';

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
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly menuCtrl = inject(MenuController);
  private readonly platform = inject(Platform);

  public isScrolled = signal<boolean>(false);
  public isMobile = signal<boolean>(false);
  public readonly isMenuOpen = signal<boolean>(false);
  public readonly navLinks = NAV_ITEMS;

  constructor() {
    addIcons({ menuOutline, closeOutline });
    this.checkPlatform();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollOffset =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled.set(scrollOffset > 50);
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkPlatform();
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

  private checkPlatform(): void {
    this.isMobile.set(this.platform.is('mobile') || window.innerWidth < 768);
  }
}
