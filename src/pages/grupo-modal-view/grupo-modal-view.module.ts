import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrupoModalViewPage } from './grupo-modal-view';

@NgModule({
  declarations: [
    GrupoModalViewPage,
  ],
  imports: [
    IonicPageModule.forChild(GrupoModalViewPage),
  ],
})
export class GrupoModalViewPageModule {}
