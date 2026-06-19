import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/layout/footer/footer';
import { Header } from './shared/layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('kid_health');
}
