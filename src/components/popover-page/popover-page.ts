import { Component } from '@angular/core';
import {  ViewController, NavParams } from 'ionic-angular';
import { GruposProvider } from "../../providers/grupos/grupos";

 @Component({
   template: `
     <ion-list no-lines>
       <ion-list-header>Selecione PrayFor</ion-list-header>
       <ion-item *ngFor="let participante of (participantes | async)" no-lines>
         <ion-avatar *ngIf="participante.img == undefined" item-start>
           <img src="./assets/images/user.png">
         </ion-avatar>
         <ion-avatar *ngIf="participante.img != undefined" item-start>
           <img src="{{participante.img}}">
         </ion-avatar>
         <h2 *ngIf="participante.nome == undefined" (click)="closePopover()">Nome</h2>
         <h2 *ngIf="participante.nome != undefined" (click)="closePopover()">{{participante.nome}}</h2>
       </ion-item>
     </ion-list>
   `
 })

export class PopoverPageComponent {

  private participantes: any;
  private grupo: any;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private gruposProvider: GruposProvider) {
      console.log('PopoverPageComponent');
      this.grupo = this.navParams.data;
      this.getAllParticipantes();
    }

  private getAllParticipantes(){
    console.log('PopoverPageComponent-getAllParticipantes()');
    console.log('getAllParticipantes ' + this.grupo.keyAllGrupos);
    this.participantes = this.gruposProvider.getParticipantes(this.grupo.keyAllGrupos);
  }

  private closePopover() {
    console.log('PopoverPageComponent-close()');
    this.viewCtrl.dismiss();
  }

}
