import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { FirebaseListObservable } from "angularfire2/database";
import { GruposProvider } from "../../providers/grupos/grupos";
import { AngularFireAuth } from "angularfire2/auth";
import { Grupo } from "../../providers/grupos/grupo";
import { PopoverMenuComponent } from "../../components/popover-menu/popover-menu";

@IonicPage()
@Component({
  selector: 'page-grupo-modal-view',
  templateUrl: 'grupo-modal-view.html',
})
export class GrupoModalViewPage {

  public participantes: FirebaseListObservable<any[]>;
  public grupo = new Grupo();
  public adm : boolean = false;
  public tabBarElement: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private gruposProvider: GruposProvider,
    private angularFireAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    public popoverCtrl: PopoverController ) {
      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      this.grupo.key = this.navParams.get('$key');
      this.grupo.keyAllGrupos = this.navParams.get('keyAllGrupos');
      this.grupo.nome = this.navParams.get('nome');
      this.grupo.descricao = this.navParams.get('descricao');
      this.grupo.privado = (this.navParams.get('privado')  == undefined) ? false : this.navParams.get('privado');
      this.grupo.localidade = (this.navParams.get('localicade')  == undefined) ? 'Brasil' : this.navParams.get('localicade');
      this.grupo.modo = (this.navParams.get('modo')  == undefined) ? 'Todos por um' : this.navParams.get('modo');
      this.grupo.fileToUpload = this.navParams.get('fileToUpload');
      this.grupo.url = (this.navParams.get('url')  == undefined) ? 'https://firebasestorage.googleapis.com/v0/b/prayfor-f63d9.appspot.com/o/allGrupos%2Fdefault.jpg?alt=media&token=c0a9b5fb-88ea-4fc7-ac5c-d1b974e5dfb8' : this.navParams.get('url');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrupoModalViewPage');
    this.getParticipantes();
    this.getParticipanteAdm()
  }

  ionViewWillUnload(){
    console.log('ionViewWillUnload GrupoModalViewPage');
    this.participantes.subscribe().unsubscribe();

  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  private getParticipantes(){
    console.log('GrupoModalViewPage-getParticipantes');
    console.log('getParticipantes ' + this.grupo.keyAllGrupos);
    this.participantes = this.gruposProvider.getParticipantes(this.grupo.keyAllGrupos);

  }

  private getParticipanteAdm(){
    console.log('GrupoModalViewPage-getParticipanteAdm');
    let userGrupo = this.gruposProvider.getParticipanteAdm(this.grupo.keyAllGrupos);
    userGrupo.subscribe(data => {
      this.adm = (data[0].adm == undefined) ? false : data[0].adm;
    });

  }

  private doSortear(){
    console.log('GrupoModalViewPage-doSortear');
    let flagDo = true;
    let alert = this.alertCtrl.create(
      {
        title: 'Sortear Participantes',
        subTitle: 'Tem certeza que gostaria de sortear novos PrayFor para os participantes?',
        buttons: [
          {
            text: 'Não',
            handler: data => {
              console.log('doSortear-Não');
            }
          },
          {
            text: 'Sim',
            handler: data => {
              console.log('doSortear-Sim');
              this.participantes.subscribe(allParticipantes => {
                if(flagDo){
                  this.gruposProvider.doSortearGrupo(allParticipantes, this.grupo.keyAllGrupos);
                  flagDo = false;
                }
              });
            }
          }
        ]
      }
    );
    alert.present();

  }

  private deletParticipante(grupoKey: any, participanteKey: any){
    console.log('GrupoModalViewPage-deletParticipante');

    this.gruposProvider.deletParticipante(grupoKey, participanteKey)
      .then(result =>{
        // let toast = this.toastCtrl.create({
        //   message: mensagem,
        //   duration: 3000
        // });
        // toast.present();
      })
      .catch(error =>{

      });
  }

  private doAdministrador(grupoKey: any, participanteKey: any){
    console.log('GrupoModalViewPage-doAdministrador');
    this.gruposProvider.doAdministrador(grupoKey, participanteKey)
      .then(result =>{

      })
      .catch(error =>{

      });
  }

  private openMenu(myEvent){
    console.log("openMenu");
    let popover = this.popoverCtrl.create(PopoverMenuComponent, this.grupo );
    popover.present({
      ev: myEvent
    });
  }
}
