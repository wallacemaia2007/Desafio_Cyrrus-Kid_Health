import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { medkitOutline, peopleOutline } from 'ionicons/icons';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { Campaign } from '../../model/campaign';
import { isCampaignCurrentlyActive } from '../../utils/vaccination-status';

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [CommonModule, RouterLink, IonIcon, StatusBadgeComponent],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignCardComponent {
  readonly campaign = input.required<Campaign>();

  constructor() {
    addIcons({ medkitOutline, peopleOutline });
  }

  protected isActive(): boolean {
    return isCampaignCurrentlyActive(this.campaign());
  }
}
