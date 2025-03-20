import { Routes } from '@angular/router';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { PagamentosComponent } from './pages/pagamentos/pagamentos.component';
import { CuponsComponent } from './pages/cupons/cupons.component';
import { EnderecosComponent } from './pages/enderecos/enderecos.component';
import { LojaComponent } from './pages/loja/loja.component';
import { NotificacaoComponent } from './pages/notificacao/notificacao.component';
import { LoginComponent } from './pages/login/login.component';
import { checkLoginAdminGuard } from '../../core/guard/auth/check-login-admin.guard';
import { RelatorioComponent } from './pages/relatorio/relatorio.component';

export const adminRoutes: Routes = [
  {
    path: 'pedidos',
    component: PedidosComponent,
    canActivate: [checkLoginAdminGuard]
  },
  {
    path: 'pedido/:id/detalhes',
    component: PedidoComponent,
    canActivate: [checkLoginAdminGuard]
  },
  {
    path: 'produtos',
    component: ProdutosComponent,
    canActivate: [checkLoginAdminGuard]
  },
  {
    path: 'pagamentos',
    component: PagamentosComponent,
    canActivate: [checkLoginAdminGuard]
  },
  {
    path: 'cupons',
    component: CuponsComponent,
    canActivate: [checkLoginAdminGuard]
  },
  {
    path: 'enderecos',
    component: EnderecosComponent,
    canActivate: [checkLoginAdminGuard]
  },
  {
    path: 'loja',
    component: LojaComponent,
    canActivate: [checkLoginAdminGuard]
  },
  {
    path: 'notificacao',
    component: NotificacaoComponent,
    canActivate: [checkLoginAdminGuard]
  },
  {
    path: 'relatorio',
    component: RelatorioComponent,
    canActivate: [checkLoginAdminGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
