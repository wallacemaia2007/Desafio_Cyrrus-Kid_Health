import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-campaign-list',
  imports: [IonContent],
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListComponent {

}
