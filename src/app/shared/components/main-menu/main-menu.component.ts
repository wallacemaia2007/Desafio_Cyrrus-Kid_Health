import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonMenu,
  IonContent,
  IonList,
  IonMenuToggle,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { medkitOutline, closeOutline } from 'ionicons/icons';
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
    IonMenuToggle,
    IonIcon,
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent implements OnDestroy {
  protected readonly navItems = NAV_ITEMS;

  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private lockedScrollY = 0;
  private isScrollLocked = false;

  constructor() {
    addIcons({ medkitOutline, closeOutline });
  }

  protected onWillOpen(): void {
    this.lockPageScroll();

    const scrollEl = this.hostRef.nativeElement.querySelector('ion-content');
    (scrollEl as any)?.scrollToTop?.(0);
  }

  protected onDidOpen(): void {
    this.dispatchMenuState(true);
  }

  protected onDidClose(): void {
    this.unlockPageScroll();
    this.dispatchMenuState(false);
  }

  ngOnDestroy(): void {
    this.unlockPageScroll();
  }

  private lockPageScroll(): void {
    if (this.isScrollLocked || typeof window === 'undefined') return;

    this.lockedScrollY =
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    document.body.style.setProperty('position', 'fixed', 'important');
    document.body.style.setProperty('top', `-${this.lockedScrollY}px`, 'important');
    document.body.style.setProperty('left', '0', 'important');
    document.body.style.setProperty('right', '0', 'important');
    document.body.style.setProperty('width', '100%', 'important');
    document.body.style.setProperty('overflow', 'hidden', 'important');

    this.isScrollLocked = true;
  }

  private unlockPageScroll(): void {
    if (!this.isScrollLocked || typeof window === 'undefined') return;

    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('left');
    document.body.style.removeProperty('right');
    document.body.style.removeProperty('width');
    document.body.style.removeProperty('overflow');
    window.scrollTo(0, this.lockedScrollY);

    this.isScrollLocked = false;
  }

  private dispatchMenuState(isOpen: boolean): void {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(
      new CustomEvent('main-menu-state-change', {
        detail: { isOpen },
      }),
    );
  }
}
