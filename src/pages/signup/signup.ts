import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from "../../providers/login/user";
import { LoginProvider } from "../../providers/login/login";
import { TabsPage } from "../tabs/tabs";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  user: User = new User();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  doRegister(){
    let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });

    this.loginProvider.createUser(this.user)
      .then((user: any) => {
          //this.loginProvider.validarUser(this.user.email);

          toast.setMessage('Tudo certo, lets go!');
          toast.present();

          this.navCtrl.push(TabsPage);
        })
        .catch((error: any) => {
          if (error.code  == 'auth/email-already-in-use') {
            toast.setMessage('Ops, esse e-mail já está em uso.');
          } else if (error.code  == 'auth/invalid-email') {
            toast.setMessage('Ops, e-mail não é valido.');
          } else if (error.code  == 'auth/operation-not-allowed') {
            toast.setMessage('Ops, nesse momento não posso deixar você criar usuários. Segura ansiedade aí!');
          } else if (error.code  == 'auth/weak-password') {
            toast.setMessage('Ops, vamos melhorar essa senha? É muito fraca.');
          }
          toast.present();
        });
  }

}
