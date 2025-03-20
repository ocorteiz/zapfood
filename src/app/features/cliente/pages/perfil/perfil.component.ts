import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NotificacaoService } from '../../../../core/services/notificacao/notificacao.service';
import { SlugService } from '../../../../core/resolver/slug.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {

  dynamicParam: string = '';

  #authService = inject(AuthService);
  #router = inject(Router);
  #slugService = inject(SlugService);

  usuario = {
    id: 0,
    nome: '',
    telefone: ''
  };

  #activatedRouter = inject(ActivatedRoute);

  ngOnInit(): void {
    this.#activatedRouter.paramMap.subscribe(params => {
      this.dynamicParam = params.get('slug') ?? '';
      this.#slugService.setParam(this.dynamicParam);
    });

    this.dynamicParam = this.#slugService.getParam();

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario)
      }
    }

  }

  logout(): void {
    this.#authService.httpLogout$().subscribe({
      next: () => {
        localStorage.removeItem('usuario')
        localStorage.removeItem('token')
        localStorage.removeItem('data')

        this.#router.navigate(['/', this.dynamicParam])
      },
      error: (error) => {
        console.log("error : ", error.error.message)
      }
    })
  }

}
