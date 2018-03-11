import { Component } from '@angular/core';
import {  ViewController, NavParams, ModalController, PopoverController } from 'ionic-angular';
import { GrupoModalPage } from "../../pages/grupo-modal/grupo-modal";
import { GruposProvider } from "../../providers/grupos/grupos";
import { PopoverPageComponent } from "../../components/popover-page/popover-page";

// @Component({
//   selector: 'popover-menu',
//   templateUrl: 'popover-menu.html'
// })
@Component({
  template: `
  <ion-list>
    <ion-item (click)="editGrupo()">
      <ion-icon name="ios-brush-outline"></ion-icon>
      Editar Grupo
    </ion-item>
    <ion-item (click)="getPrayFor()">
      <ion-icon name="ios-bookmark-outline"></ion-icon>
      Escolher PrayFor
    </ion-item>
  </ion-list>
  `
})

export class PopoverMenuComponent {

  text: string;
  public grupo : any;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private gruposProvider: GruposProvider,
    public popoverCtrl: PopoverController ) {
    console.log('PopoverMenuComponent Component');
    this.grupo = this.navParams.data;
    console.log(this.grupo);
  }

  private editGrupo(){
    console.log('PopoverMenuComponent-editGrupo()');

    let creatGrupoModal = this.modalCtrl.create(GrupoModalPage, this.grupo);
    creatGrupoModal.onDidDismiss(
      data => {
        if (data) {
          console.log(data);
          this.grupo = data;
          this.gruposProvider.updateAllGruposAndGrupo(this.grupo);
        }
      }
    );
    creatGrupoModal.present();

    this.closePopover();
  }

  private getPrayFor(){
    console.log('PopoverMenuComponent-getPrayFor()');
    let popover = this.popoverCtrl.create(PopoverPageComponent, this.grupo );
    popover.present({});
    this.closePopover();
  }

  private closePopover() {
    console.log('PopoverMenuComponent-closePopover()');
    this.viewCtrl.dismiss();
  }

}
