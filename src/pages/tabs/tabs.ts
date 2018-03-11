import { Component } from '@angular/core';

import { GruposPage } from '../grupos/grupos';
import { OracoesPage } from "../oracoes/oracoes";
import { PedidosPage } from "../pedidos/pedidos";
import { PerfilPage } from "../perfil/perfil";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = OracoesPage;
  tab2Root = GruposPage;
  tab3Root = PedidosPage;
  tab4Root = PerfilPage;

  constructor() {

  }
}
