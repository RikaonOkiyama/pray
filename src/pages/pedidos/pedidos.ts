import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, reorderArray } from 'ionic-angular';
import { AlertController, ModalController, ViewController, PopoverController  } from 'ionic-angular';
import { PedidosProvider } from "../../providers/pedidos/pedidos";
import { Pedido } from "../../providers/pedidos/pedido";
import { LoginProvider } from "../../providers/login/login";
import { PedidoModalPage } from "../pedido-modal/pedido-modal";
import { ComentarioModalPage } from "../comentario-modal/comentario-modal";
import { FirebaseListObservable } from "angularfire2/database";
import { PopoverPageComponent } from "../../components/popover-page/popover-page";

@IonicPage()
@Component({
  selector: 'page-pedidos',
  templateUrl: 'pedidos.html',
  providers: [
    PedidosProvider,
    Pedido
  ]
})
export class PedidosPage {

  public pedidos: FirebaseListObservable<any[]>;
  public lista_pedidos = new Array<any>();
  public pedido = new Pedido();
  public noItem : boolean;
  public user : any;
  public isReorder : boolean;
  private comentExpanded = false;
  private collapsible:  any = [];
  @ViewChild("tc", {read: ElementRef}) cardComent: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private pedidosProvaider: PedidosProvider,
    private loginProvider: LoginProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public renderer: Renderer) {
      this.isReorder = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidosPage');
    this.getAllPedidos();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter PedidosPage');
    this.getAllPedidos();

  }

  ionViewWillUnload(){
    console.log('ionViewWillUnload PedidosPage');
    this.pedidos.subscribe().unsubscribe();
  }

  // Método para atualizar a view
  doRefresh(refresher) {
    console.log('PedidosPage-doRefresh');

    this.getAllPedidos();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  // Método da provider para pegar os Pedidos
  getAllPedidos() {
    console.log('PedidosPage-getAllOracoes');
    this.pedidos = this.pedidosProvaider.getAlltPedidos();
    this.pedidos.forEach(element => {
        this.noItem = (element.length > 0)? false: true;
        for (let i = 0; i < element.length; i++) {
            this.collapsible[i] = {'hide': false};
        }
    });

    this.loginProvider.getPhoto().then( data =>{
      this.user = data;
    });

  }

  // Metodo da provider para adicionar um Pedido
  postPedido(pedido: Pedido) {
    console.log('PedidosPage-postPedido');
    this.pedidosProvaider.postPedido(pedido);

  }

  // Método para apresentar Pedido
  doClickCard(pedido: Pedido) {
    console.log('PedidosPage-doClickCard');
    // Apresenta o pedido selecionado
    let alert = this.alertCtrl.create(
      {
        title: pedido.titulo,
        subTitle: pedido.descricao,
        buttons: [
          {
            text: 'Deletar',
            handler: data => {
              console.log('doClickCard-Deletar');
              this.delete_pedido(pedido);
            }
          },
          {
            text: 'Editar',
            handler: data => {
              console.log('doClickCard-Editar');
              this.openModalPedido(pedido)
            }
          }
        ]
      }
    );
    alert.present();

  }

  // Cria e apresenta a Modal de Pedido para Editar ou Criar um novo pedido
  openModalPedido(pedido: Pedido) {
    console.log('PedidosPage-openModalPedido');
    let pedidoModal = this.modalCtrl.create(PedidoModalPage, pedido);

    pedidoModal.onDidDismiss(
      data => {
        if(data){
          this.pedido = data;
          this.postPedido(this.pedido);
        }
      }
    );
    pedidoModal.present();

    this.getAllPedidos();
  }

  addPedido() {
    console.log('PedidosPage-addPedido');
    this.openModalPedido(new Pedido());

  }

  // Método para deletar um Pedido
  delete_pedido(pedido: Pedido) {
    console.log('PedidosPage-delete_pedido');
    this.pedidosProvaider.deletePedido(pedido);

  }

  // Método para publicar um Pedido
  publicar_pedido(pedido: Pedido) {
    console.log('PedidosPage-publicar_pedido');
    this.pedidosProvaider.publicPedido(pedido);

  }

  public addComentario(pedidKey: any){
    console.log('PedidosPage-addComentario');
    let comentarioModal = this.modalCtrl.create(ComentarioModalPage);

    comentarioModal.onDidDismiss(
      comentario => {
        if(comentario){
          this.pedidosProvaider.postComentario(pedidKey, comentario);
        }
      }
    );
    comentarioModal.present();

  }

  public presentPopover(myEvent, pedido: any) {
    console.log(pedido);
    let popover = this.popoverCtrl.create(PopoverPageComponent, pedido );
    popover.present({
      ev: myEvent
    });
  }

  public reorderItem(indexes ){
    console.log('PedidosPage-reorderItem');

    let doAdd = true;

    this.pedidos.subscribe(
      pedidos => {
        if(doAdd){
          let keyFrom = pedidos[indexes.from].$key;
          let keyTo = pedidos[indexes.to].$key;
          this.pedidosProvaider.setOrder(keyFrom, indexes.to);
          this.pedidosProvaider.setOrder(keyTo, indexes.from);
          doAdd = false;
        }
      }
    );

  }

  public menuOptions( event){
    console.log('PedidosPage-menuOptions');
    this.isReorder = (this.isReorder) ? false: true;
  }

  public toggleComent(pedido: any){
      console.log('PedidosPage-toggleComent');
      console.log(pedido);
      //this.renderer.setElementStyle(this.cardComent.nativeElement, 'background', '#f53d3d');
  }

}
