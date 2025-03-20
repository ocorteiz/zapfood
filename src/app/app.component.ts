import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { LojaService } from './core/services/loja/loja.service';
import { ILoja } from './core/interfaces/ILoja.interface';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {

  constructor(
    private lojaService: LojaService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.lojaService.httpFind$().subscribe({
        next: (loja: ILoja | null) => {
          if (loja) {
            const corDeTema = loja.corDeTema || '#F29F05';
            document.documentElement.style.setProperty('--primary', corDeTema);
            this.updateFavicon(loja.logo);
            const nomeDaLoja = loja.nome || 'Minha Loja';
            document.title = nomeDaLoja.toUpperCase();
          }
        },
        error: (error) => console.log("erro: ", error.error.message)
      });
    }
  }

  private updateFavicon(faviconUrl: string): void {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = `http://localhost:8080/${faviconUrl}`;
  }

}
