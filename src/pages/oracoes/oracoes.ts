import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ToastController, PopoverController } from 'ionic-angular';
import { OracoesProvider } from "../../providers/oracoes/oracoes";
import { LoginProvider } from "../../providers/login/login";
import { FirebaseListObservable } from "angularfire2/database";

@IonicPage()
@Component({
  selector: 'page-oracoes',
  templateUrl: 'oracoes.html',
  providers: [
    OracoesProvider
  ]
})
export class OracoesPage {

  public lista_grupos = new Array<any>();
  public oracoes: FirebaseListObservable<any[]>;
  public noItem : boolean;
  public user : any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
    private oracoesProvider: OracoesProvider,
    private loginProvider: LoginProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OracoesPage');
    this.getAllOracoes();

  }

  ionViewWillUnload(){
    console.log('ionViewWillUnload OracoesPage');
    //this.pedidos.subscribe().unsubscribe();
  }

  getAllOracoes() {
    console.log('OracoesPage-getAllOracoes');
    this.oracoes = this.oracoesProvider.getAlltOracoes();
    this.oracoes.forEach(element => {
        this.noItem = (element.length > 0)? false: true;
    });

    this.loginProvider.getPhoto().then( data =>{
      this.user = data;
    });

  }

  postOracao(grupoKey: number, prayuid: number, oracaoKey: number) {
    console.log('OracoesPage-postOracao');
    this.oracoesProvider.postOracao(grupoKey, prayuid, oracaoKey).then(result => {
        this.oracoesProvider.postOracaoPedidos(grupoKey, prayuid, oracaoKey);
    });
  }

  doClickCard(grupoKey: any, prayuid: any, oracaoKey: any, orarcaoTitulo: any){
    console.log('OracoesPage-doClickCard');

    // Apresenta o pedido selecionado
    let alert = this.alertCtrl.create(
      {
        title: orarcaoTitulo,/*
        subTitle: "", */
        buttons: [
          {
            text: 'Agendar',
            handler: data => {
              console.log('doClickCard-Agendar');
              //this.delete_pedido(this.lista_pedidos[rowId]);
            }
          },
          {
            text: 'PrayFor',
            handler: data => {
              console.log('doClickCard-PrayFor');
              this.postOracao(grupoKey, prayuid, oracaoKey);
            }
          }
        ]
      }
    );
    alert.present();
  }

  readComentarios(ev){
    // let popover = this.popoverCtrl.create(PopoverPage, {
    // });
    // popover.present({
    //   ev: ev
    // });
  }
}
