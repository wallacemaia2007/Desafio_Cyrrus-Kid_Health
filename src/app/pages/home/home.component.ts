import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, interval, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { GridComponent } from '../../shared/components/grid/grid.component';
import { Campaign } from '../../shared/model/campaign';
import { CampaignService } from '../../core/services/campaign.service';
import { CampaignCardComponent } from '../../shared/components/campaign-card/campaign-card.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { isCampaignCurrentlyActive } from '../../shared/utils/vaccination-status';

interface HeroSlide {
  image: string;
  alt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CampaignCardComponent,
    PageHeaderComponent,
    LoadingStateComponent,
    GridComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly campaignService = inject(CampaignService);
  private readonly destroyRef = inject(DestroyRef);

  protected campaigns$!: Observable<Campaign[]>;

  protected readonly activeSlide = signal(0);
  protected readonly heroSlides: HeroSlide[] = [
    {
      image:
        'https://img.magnific.com/fotos-gratis/doutor-dando-um-high-five-a-uma-menina-sorridente-sentada-no-colo-de-sua-mae-durante-uma-consulta-medica_329181-7634.jpg?semt=ais_hybrid&w=740&q=80',
      alt: 'Criança sorrindo durante consulta médica',
    },
    {
      image: 'https://sciath.com.br/wp-content/uploads/2022/06/pediatra.jpg',
      alt: 'Pediatra atendendo um bebê com carinho',
    },
    {
      image:
        'https://s2.glbimg.com/5Mhn5LcywBB39AC1vXsaFAIwbRQ=/e.glbimg.com/og/ed/f/original/2013/02/04/shutterstock_93281227.jpg',
      alt: 'Mãe e filho em consulta de rotina',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.campaigns$ = this.campaignService
      .getCampaigns()
      .pipe(map((campaigns) => campaigns.filter((c) => isCampaignCurrentlyActive(c)).slice(0, 4)));

    this.startAutoplay();
  }

  protected goToSlide(index: number): void {
    this.activeSlide.set(index);
  }

  private startAutoplay(): void {
    interval(5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.activeSlide.update((current) => (current + 1) % this.heroSlides.length);
      });
  }
}
