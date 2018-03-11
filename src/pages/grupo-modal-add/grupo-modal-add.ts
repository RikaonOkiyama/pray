import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { GruposProvider } from "../../providers/grupos/grupos";
import { Observable } from "rxjs/Observable";
import { Grupo } from "../../providers/grupos/grupo";

@IonicPage()
@Component({
  selector: 'page-grupo-modal-add',
  templateUrl: 'grupo-modal-add.html',
})
export class GrupoModalAddPage {

  public grupos: Observable<Grupo[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private gruposProvider: GruposProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrupoModalAddPage');
    this.getAllGrupos();
  }

  public getAllGrupos() {
    console.log('GrupoModalAddPage-getAllGrupos');
    this.grupos = this.gruposProvider.getAllGrupos();
    console.log(this.grupos);
  }

  public searchtAllGrupos(event: any) {
    console.log('GruposPage-searchtAllGrupos');
    let nome = event.target.value;
    console.log(nome);

    if (nome && nome.trim() != '') {
      this.grupos = this.gruposProvider.seachAllGrupos(nome);
    } else {
      this.grupos = this.gruposProvider.getAllGrupos();
    }
  }

  public async doAddGrupo(grupo: any) {
    console.log('GrupoModalAddPage-doAddGrupo');

    // Apresenta o pedido selecionado
    let alert = this.alertCtrl.create(
      {
        title: grupo.nome,
        subTitle: grupo.descricao,
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              console.log('doAddGrupo-Cancelar');
            }
          },
          {
            text: 'Participar',
            handler: data => {
              console.log('doAddGrupo-Participar');
                this.gruposProvider.seachGrupo(grupo)
                  .then(gruposParticipante => {
                      this.validatAndSaveGrupo(gruposParticipante, grupo);
                });
            }
          }
        ]
      }
    );
    alert.present();
  }

  private validatAndSaveGrupo(gruposParticipante: Observable<any[]>, grupo: any) {
    console.log('GrupoModalAddPage-validatAndSaveGrupo');
    let mensagem: string;
    let doAdd = true;

    gruposParticipante.subscribe(
      (participantes) => {
        if(doAdd){
          this.gruposProvider.validatAndSave(participantes, grupo);
          doAdd = false;
        }
      },
      (err) => console.log(err),
      () => {
        gruposParticipante.subscribe().unsubscribe();
      }
    );

    /* if (gruposParticipante) {
      mensagem = 'Você já faz parte do grupo!';
    } else {
      mensagem = 'Grupo adicionado!';
      grupo.keyAllGrupos = grupo.$key;
      grupo.key = false;
      this.gruposProvider.postGrupo(grupo);
    } */
  }

}
