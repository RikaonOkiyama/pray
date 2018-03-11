import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App } from 'ionic-angular';
import { User } from "../../providers/login/user";
import { LoginProvider } from "../../providers/login/login";
import { AngularFireAuth } from "angularfire2/auth";
import { FirebaseListObservable } from "angularfire2/database";
import * as firebase from 'firebase/app';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  public user = new User();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    private angularFireAuth: AngularFireAuth,
    public app: App,
    private crop: Crop,
    private imagePicker: ImagePicker) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
    this.getUser();
  }

  public getUser() {
    console.log('PerfilPage-getUser');
    this.angularFireAuth.authState.subscribe((user: firebase.User) =>{
      console.log(user);
      this.user.nome = user.displayName;
      this.user.url = user.photoURL;
    });

  }

  public changerNome(event: any) {
    console.log('PerfilPage-changerNome');
    let nome = event.target.value;
    console.log(nome);

    if (nome && nome.trim() != '') {
      this.angularFireAuth.auth.currentUser.updateProfile({
        displayName:this.user.nome,
        photoURL: this.user.url
      });
    }
  }

  public changerNick(event: any) {
    console.log('PerfilPage-changerNick');
    let nick = event.target.value;
    console.log(nick);

    if (nick && nick.trim() != '') {
      //this.loginProvider.postNick(nick);
    }
  }

  public postPhoto() {
    console.log('PerfilPage-postPhoto');
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
    console.log('PerfilPage-getPermissao');
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
    console.log('PerfilPage-getImagem');
    let options = {
      maximumImagesCount: 1,
      width: 500,
      height: 500,
      quality: 50,
      outputType: 1
    };

    this.imagePicker.getPictures(options).then(results => {
        if (results.length > 0) {
          // this.crop.crop('data:image/png;base64,' + results[0], { quality: 60 })
          //   .then(
          //   newImage => this.user.imgPath =  newImage,
          //   error => console.error('Error cropping image', error)
          //   );
          this.user.imgPath = 'data:image/png;base64,' + results[0];
          this.crop.crop(results[0], { quality: 60 })
            .then(
            newFile => this.user.fileToUpload = newFile,
            error => console.error('Error cropping file', error)
            );
        } else {
          this.user.imgPath = '';
          this.user.fileToUpload = null;
        }
        this.loginProvider.postPhoto(this.user);
      })
      .catch(error => {
        console.error('Erro ao recuperar a imagem', error);
      });
    console.log('PerfilPage-getImagem - FIM');
  }

  public doLogout(){
    console.log('PerfilPage-doLogout');
    this.loginProvider.logout()
      .then(() =>{
        const root = this.app.getRootNav();
        root.popToRoot();
      }).catch((error) =>{
        console.error(error);
      });
  }
}
