import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-comentario-modal',
  templateUrl: 'comentario-modal.html',
})
export class ComentarioModalPage {
  comentario: string;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  public ionViewDidLoad() {
    console.log('ionViewDidLoad ComentarioModalPage');
  }

  public closeModal(){
    console.log('ComentarioModalPage-closeModal');
    this.viewCtrl.dismiss();

  }

  public saveModal(){
    console.log('ComentarioModalPage-saveModal');
    this.viewCtrl.dismiss(this.comentario);

  }

}
