import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from './shared/layout/footer/footer';
import { HeaderComponent } from './shared/layout/header/header.component';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, Footer, IonicModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
