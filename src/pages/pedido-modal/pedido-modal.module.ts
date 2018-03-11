import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PedidoModalPage } from './pedido-modal';

@NgModule({
  declarations: [
    PedidoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PedidoModalPage),
  ],
})
export class PedidoModalPageModule {}
