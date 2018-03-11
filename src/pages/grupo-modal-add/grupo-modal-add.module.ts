import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrupoModalAddPage } from './grupo-modal-add';

@NgModule({
  declarations: [
    GrupoModalAddPage,
  ],
  imports: [
    IonicPageModule.forChild(GrupoModalAddPage),
  ],
})
export class GrupoModalAddPageModule {}
