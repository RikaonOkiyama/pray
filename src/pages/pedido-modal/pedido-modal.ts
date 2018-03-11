import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Pedido } from "../../providers/pedidos/pedido";

/**
 * Generated class for the PedidoModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pedido-modal',
  templateUrl: 'pedido-modal.html',
})
export class PedidoModalPage {

  public pedido = new Pedido();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {

    this.pedido.key = this.navParams.get('$key');
    this.pedido.titulo = this.navParams.get('titulo');
    this.pedido.descricao = this.navParams.get('descricao');
    this.pedido.publico = (this.navParams.get('publico') == undefined) ? false : this.navParams.get('publico');

    console.log(this.pedido);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidoModalPage');
  }

  closePedidoModal() {
    console.log("PedidoModalPage - closePedidoModal");
    this.viewCtrl.dismiss();
  }

  savePedidoModal() {
    console.log("PedidoModalPage - savePedidoModal");
    console.log(this.pedido);
    this.viewCtrl.dismiss(this.pedido);
  }


}
