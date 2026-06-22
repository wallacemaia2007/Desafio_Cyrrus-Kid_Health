import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollHide]',
  standalone: true,
})
export class ScrollHideDirective implements OnInit, OnDestroy {
  private lastScrollY = 0;
  private ticking = false;
  private removeScrollListener?: () => void;
  private readonly HIDE_THRESHOLD = 80;
  private readonly SCROLL_DELTA = 10;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scrollHandler = (event: Event) => this.onScroll(event);
    window.addEventListener('scroll', scrollHandler, { capture: true, passive: true });
    this.removeScrollListener = () => window.removeEventListener('scroll', scrollHandler, true);

    this.processScroll();
  }

  ngOnDestroy(): void {
    this.removeScrollListener?.();
  }

  private onScroll(event: Event): void {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.processScroll(event);
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private processScroll(event?: Event): void {
    const scrollY = this.getScrollY(event);

    this.updateScrolledState(scrollY);
    this.updateHiddenState(scrollY);

    this.lastScrollY = scrollY;
  }

  private getScrollY(event?: Event): number {
    const windowScrollY =
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (windowScrollY > 0 || !event?.target || event.target === document) {
      return windowScrollY;
    }

    if (event.target instanceof HTMLElement) {
      return event.target.scrollTop;
    }

    return windowScrollY;
  }

  private updateScrolledState(scrollY: number): void {
    if (scrollY > 24) {
      this.renderer.addClass(this.el.nativeElement, 'header-scrolled');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'header-scrolled');
    }
  }

  private updateHiddenState(scrollY: number): void {
    const delta = scrollY - this.lastScrollY;

    if (scrollY <= 5) {
      this.renderer.removeClass(this.el.nativeElement, 'header-hidden');
      return;
    }

    if (delta > this.SCROLL_DELTA && scrollY > this.HIDE_THRESHOLD) {
      this.renderer.addClass(this.el.nativeElement, 'header-hidden');
    } else if (delta < -this.SCROLL_DELTA) {
      this.renderer.removeClass(this.el.nativeElement, 'header-hidden');
    }
  }
}
