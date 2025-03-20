import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { CartComponent } from './pages/cart/cart.component';
import { FinalizarComponent } from './pages/finalizar/finalizar.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { LojaComponent } from './pages/loja/loja.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { checkLoginGuard } from '../../core/guard/auth/check-login.guard';
import { CuponsComponent } from './pages/cupons/cupons.component';
import { EnderecosComponent } from './pages/enderecos/enderecos.component';
import { PixComponent } from './pages/pagamento/pagamento.component';
import { checkStatusGuard } from '../../core/guard/status/check-status.guard';
import { InativaComponent } from './pages/inativa/inativa.component';
import { checkLojaGuard } from '../../core/guard/loja/check-loja.guard';
import { VerificacaoRegisterComponent } from './components/verificacao-register/verificacao-register.component';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { AlterarComponent } from './pages/alterar/alterar.component';
import { VerificacaoAlterarComponent } from './pages/verificacao-alterar/verificacao-alterar.component';

export const clienteRoutes: Routes = [
  {
    path: 'cliente/register',
    component: RegisterComponent
  },
  {
    path: 'cliente/login',
    component: LoginComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [checkLojaGuard, checkLoginGuard]
  },
  {
    path: 'cliente/cupons',
    component: CuponsComponent,
    canActivate: [checkLojaGuard, checkLoginGuard]
  },
  {
    path: 'cliente/enderecos',
    component: EnderecosComponent,
    canActivate: [checkLojaGuard, checkLoginGuard]
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [checkLojaGuard]
  },
  {
    path: 'detalhes',
    component: LojaComponent,
    canActivate: [checkLojaGuard]
  },
  {
    path: 'produto/:id',
    component: ProdutoComponent,
    canActivate: [checkLojaGuard, checkStatusGuard, checkLoginGuard]
  },
  {
    path: 'carrinho',
    component: CartComponent,
    canActivate: [checkLojaGuard, checkStatusGuard, checkLoginGuard]
  },
  {
    path: 'finalizar',
    component: FinalizarComponent,
    canActivate: [checkLojaGuard, checkStatusGuard, checkLoginGuard]
  },
  {
    path: 'pedido/:id',
    component: PedidoComponent,
    canActivate: [checkLojaGuard, checkLoginGuard]
  },
  {
    path: 'meus-pedidos',
    component: PedidosComponent,
    canActivate: [checkLoginGuard]
  },
  {
    path: 'pagamento/:id',
    component: PixComponent,
    canActivate: [checkLojaGuard, checkStatusGuard, checkLoginGuard]
  },
  {
    path: 'inativa',
    component: InativaComponent
  },
  {
    path: 'verificacao-register',
    component: VerificacaoRegisterComponent,
    canActivate: [checkLojaGuard]
  },
  {
    path: 'verificacao-alterar',
    component: VerificacaoAlterarComponent,
    canActivate: [checkLojaGuard]
  },
  {
    path: 'recuperar',
    component: RecuperarComponent,
    canActivate: [checkLojaGuard]
  },
  {
    path: 'alterar',
    component: AlterarComponent,
    canActivate: [checkLojaGuard]
  }
];
