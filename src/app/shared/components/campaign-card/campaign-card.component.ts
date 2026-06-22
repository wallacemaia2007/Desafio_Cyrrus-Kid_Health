import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { medkitOutline, peopleOutline } from 'ionicons/icons';
import { Campaign } from '../../model/campaign';

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [CommonModule, RouterLink, IonIcon],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignCardComponent {
  readonly campaign = input.required<Campaign>();

  constructor() {
    addIcons({ medkitOutline, peopleOutline });
  }
}
