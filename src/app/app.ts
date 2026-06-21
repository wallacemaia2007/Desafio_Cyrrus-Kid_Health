import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';
import { MainMenuComponent } from "./shared/components/main-menu/main-menu.component";

@Component({
  selector: 'app-root',
  imports: [IonicModule, RouterOutlet, MainMenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
