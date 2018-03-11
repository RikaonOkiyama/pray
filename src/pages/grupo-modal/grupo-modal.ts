import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Grupo } from "../../providers/grupos/grupo";
import { ImagePicker } from '@ionic-native/image-picker';

@IonicPage()
@Component({
  selector: 'page-grupo-modal',
  templateUrl: 'grupo-modal.html',
})
export class GrupoModalPage {

  public grupo = new Grupo();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private imagePicker: ImagePicker) {
      this.grupo.key = this.navParams.get('$key');
      this.grupo.keyAllGrupos = this.navParams.get('keyAllGrupos');
      this.grupo.nome = this.navParams.get('nome');
      this.grupo.descricao = this.navParams.get('descricao');
      this.grupo.privado = (this.navParams.get('privado')  == undefined) ? false : this.navParams.get('privado');
      this.grupo.localidade = (this.navParams.get('localidade')  == undefined) ? 'Brasil' : this.navParams.get('localidade');
      this.grupo.modo = (this.navParams.get('modo')  == undefined) ? 'Todos por um' : this.navParams.get('modo');
      this.grupo.fileToUpload = this.navParams.get('fileToUpload');
      this.grupo.url = (this.navParams.get('url')  == undefined) ? 'https://firebasestorage.googleapis.com/v0/b/prayfor-f63d9.appspot.com/o/allGrupos%2Fdefault.jpg?alt=media&token=c0a9b5fb-88ea-4fc7-ac5c-d1b974e5dfb8' : this.navParams.get('url');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrupoModalPage');

  }

  public saveModal(){
    console.log('GrupoModalPage-saveModal');
    this.viewCtrl.dismiss(this.grupo);

  }

  public closeModal(){
    console.log('GrupoModalPage-saveModal');
    this.viewCtrl.dismiss();

  }

  public pickerCapa() {
    console.log('GrupoModalPage-pickerCapa');
    this.imagePicker.hasReadPermission()
      .then(hasPermission => {
        if (hasPermission) {
          this.getImagem();
        } else {
          this.getPermissao();
        }
      }).catch(error => {
        console.error('Erro ao verificar permissão', error);
      });

  }

  private getPermissao() {
    console.log('GrupoModalPage-getPermissao');
    this.imagePicker.requestReadPermission()
      .then(hasPermission => {
        if (hasPermission) {
          this.getImagem();
        } else {
          console.error('Permissão negada');
        }
      }).catch(error => {
        console.error('Erro ao solicitar permissão', error);
      });
  }

  private getImagem() {
    console.log('GrupoModalPage-getImagem');
    let options = {
      maximumImagesCount: 1,
      width: 500,
      height: 500,
      quality: 50,
      outputType: 1
    };

    this.imagePicker.getPictures(options)
      .then(results => {
        if (results.length > 0) {
          this.grupo.imgPath = 'data:image/png;base64,' + results[0];
          this.grupo.fileToUpload = results[0];
        } else {
          this.grupo.imgPath = '';
          this.grupo.fileToUpload = null;
        }
      })
      .catch(error => {
        console.error('Erro ao recuperar a imagem', error);
      });

  }

}
