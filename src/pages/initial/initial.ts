import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { SignupPage } from "../signup/signup";

@IonicPage()
@Component({
  selector: 'page-initial',
  templateUrl: 'initial.html',
})
export class InitialPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InitialPage');
  }

  //Chama tela de login
  doLogin(){
    this.navCtrl.push(LoginPage);

  }

  //Chama tela de Singup
  doSignup(){
    this.navCtrl.push(SignupPage);
  }

}
