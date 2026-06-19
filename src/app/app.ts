import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonApp } from '@ionic/angular/standalone';
import { HeaderComponent } from './shared/layout/header/header.component';
import { Footer } from './shared/layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IonApp, Footer, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('kid_health');
}
