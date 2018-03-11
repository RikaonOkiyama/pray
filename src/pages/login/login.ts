import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TabsPage } from "../tabs/tabs";
import { User } from "../../providers/login/user";
import { LoginProvider } from "../../providers/login/login";
import { ConfigProvider } from "../../providers/config/config";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user: User = new User();
  loginKeep = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private loginProvider: LoginProvider,
    private configProvider: ConfigProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.getEmailSave();
  }

  private getEmailSave(){
    console.log('LoginPage-getEmailSaveLocal');
    let config = JSON.parse(this.configProvider.getConfigData());
    this.user.email = config.user_email;

  }

  async doLogin() {
    console.log('LoginPage-doLogin');
    this.loginProvider.login(this.user)
      .then(() => {
        this.configProvider.setConfigDate(false, this.loginKeep, this.user.email, this.user.password);
        this.navCtrl.push(TabsPage);
      })
      .catch((error: any) => {
        let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
        if (error.code == 'auth/invalid-email') {
          toast.setMessage('Ops, e-mail invalido.');
        } else if (error.code == 'auth/user-disabled') {
          toast.setMessage('Ops, usuário está desativado.');
        } else if (error.code == 'auth/user-not-found') {
          toast.setMessage('Ops, você ainda não existe. Vamos criar uma conta?');
        } else if (error.code == 'auth/wrong-password') {
          toast.setMessage('Ops, acho que erramos a senha. Relaxa, acontece!');
        }
        toast.present();
      });

  }

  public loginGoogle(){
    console.log('LoginPage-loginGoogle');
    this.loginProvider.loginGoogle()
      .then(() => {
        this.navCtrl.setRoot(TabsPage);
      })
      .catch((error) => {
        this.toastCtrl.create({
          duration: 3000,
          position: 'bottom',
          message: 'Ops, erro no login com Google!'
          })
          .present();
      });

  }

  public loginFacebook(){
    console.log('LoginPage-loginFacebook');
    this.loginProvider.loginFacebook()
      .then(() => {
        this.navCtrl.setRoot(TabsPage);
      })
      .catch((error) => {
        this.toastCtrl.create({
          duration: 3000,
          position: 'bottom',
          message: 'Ops, erro no login com Facebook!'
          })
          .present();
      });

  }

}
