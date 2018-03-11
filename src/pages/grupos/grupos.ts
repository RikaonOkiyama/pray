import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';
import { ActionSheetController, ModalController } from 'ionic-angular';
import { GruposProvider } from "../../providers/grupos/grupos";
import { LoginProvider } from "../../providers/login/login";
import { FirebaseListObservable } from 'angularfire2/database';
import { GrupoModalPage } from "../grupo-modal/grupo-modal";
import { Grupo } from "../../providers/grupos/grupo";
import { GrupoModalAddPage } from "../grupo-modal-add/grupo-modal-add";
import { GrupoModalViewPage } from "../grupo-modal-view/grupo-modal-view";

@IonicPage()
@Component({
  selector: 'page-grupos',
  templateUrl: 'grupos.html',
})
export class GruposPage {

  public grupos: FirebaseListObservable<any[]>;
  public grupo = new Grupo();
  noItem : boolean;
  public user : any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private gruposProvider: GruposProvider,
    private loginProvider: LoginProvider,
    private modalCtrl: ModalController,
  public actionSheetCtrl: ActionSheetController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GruposPage');
    this.getAllGrupos();

  }

  ionViewWillUnload(){
    console.log('ionViewWillUnload GruposPage');
    this.grupos.subscribe().unsubscribe();
  }

  // Método para pegar os grupos disponíveis
  public getAllGrupos() {
    console.log('GruposPage-getAllGrupos');
    this.grupos = this.gruposProvider.getGrupos();
    this.grupos.forEach(element => {
        this.noItem = (element.length > 0)? false: true;
    });

    this.loginProvider.getPhoto().then( data =>{
      this.user = data;
    });
  }

  // Método para acionar uma grupo já existente
  public addGrupo(fab:FabContainer) {
    console.log('GruposPage-addGrupo');
    this.navCtrl.push(GrupoModalAddPage);
    fab.close();

  }

  // Método para criar um grupo novo
  public createGrupo(fab:FabContainer) {
    console.log('GruposPage-createGrupo');
    let creatGrupoModal = this.modalCtrl.create(GrupoModalPage);
    creatGrupoModal.onDidDismiss(
      data => {
        if (data) {
          console.log(data);
          this.grupo = data;
          this.gruposProvider.createAllGruposAndGrupo(this.grupo);
        }
      }
    );
    creatGrupoModal.present();
    fab.close();

  }

  public doClickGrupos(grupo: any) {
    console.log('GruposPage-doClickGrupos');
    this.navCtrl.push(GrupoModalViewPage, grupo);

  }

  public menuOptions($event, grupo: any){
    console.log('GruposPage-menuOptions');

    let actionSheet = this.actionSheetCtrl.create({
      title: grupo.nome,
      buttons: [
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            console.log('menuOptions-Excluir');
            this.gruposProvider.deletParticipante(grupo.keyAllGrupos)
              .then( resp => {
                console.log('Participante saiu do grupo');
                this.gruposProvider.deletGrupo(grupo.keyAllGrupos);
                }
              ).catch( error => {
                console.log(error);
                }
              );
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

  }
}
