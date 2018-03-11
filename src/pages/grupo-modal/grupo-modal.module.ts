import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrupoModalPage } from './grupo-modal';

@NgModule({
  declarations: [
    GrupoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(GrupoModalPage),
  ],
})
export class GrupoModalPageModule {}
