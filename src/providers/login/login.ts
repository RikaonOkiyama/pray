import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "angularfire2/auth";
import { FirebaseApp } from 'angularfire2';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { User } from "./user";
import { ConfigProvider } from "../config/config";

@Injectable()
export class LoginProvider {

  constructor(
    public http: Http,
    public afAuth: AngularFireAuth,
    private fb: FirebaseApp,
    private configProvider: ConfigProvider,
    private googlePlus: GooglePlus,
    private facebook: Facebook) {

  }

  public getUser() {
    console.log('LoginProvider-getUser');
    return this.afAuth.authState.subscribe();
  }

  // Cria uma nova conta
  public createUser(user: User) {
    console.log('LoginProvider-createUser');
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);

  }

  public validarUser(emai: string) {
    console.log('LoginProvider-validarUser');
    return this.afAuth.auth.fetchProvidersForEmail(emai);

  }

  // Login com email e senha
  public login(user: User) {
    console.log('LoginProvider-login');
    this.configProvider.setConfigDate(false, false, user.email);
    return this.afAuth.auth.signInWithEmailAndPassword(
      user.email,
      user.password);

  }

  public loginFacebook() {
    console.log('LoginProvider-loginFacebook');
    return this.facebook.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        console.log(res);
        return this.afAuth.auth.signInWithCredential(
          firebase.auth.FacebookAuthProvider.credential(
            res.authResponse.accessToken));
      });
  }

  public loginGoogle() {
    console.log('LoginProvider-loginGoogle');
    return this.googlePlus.login({
      'webClientId': '793404838460-h3b0kfouab41jt393oc6n17saoij9i2m.apps.googleusercontent.com',
      'offline': true
    })
      .then(res => {
        return this.afAuth.auth.signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then((user: firebase.User) => {
            // atualizando o profile do usuario
            return user.updateProfile({
               displayName: res.displayName,
               photoURL: res.imageUrl
            });
          });
      });

  }

  public logout(): firebase.Promise<any> {
    console.log('LoginProvider-logout');

    if (this.afAuth.auth.currentUser.providerData.length) {
      for (var i = 0; i < this.afAuth.auth.currentUser.providerData.length; i++) {
        var provider = this.afAuth.auth.currentUser.providerData[i];

         if (provider.providerId == firebase.auth.GoogleAuthProvider.PROVIDER_ID) {
          return this.googlePlus.disconnect()
            .then(() => {
              return this.signOutFirebase();
            });
        } else if (provider.providerId == firebase.auth.FacebookAuthProvider.PROVIDER_ID) {
          return this.facebook.logout()
            .then(() => {
              return this.signOutFirebase();
            });
        } else {
           this.configProvider.setConfigDate(false, false, null, "");          
          return this.afAuth.auth.signOut();//this.signOutFirebase();
        }
      }
    }

  }

  private signOutFirebase() {
    console.log('LoginProvider-signOutFirebase');
    return this.afAuth.auth.signOut();

  }

  public resetSenha(email: string) {
    console.log('LoginProvider-resetSenha');
    return this.afAuth.auth.sendPasswordResetEmail(email);

  }

  public postPhoto(user: any) {
    console.log('LoginProvider-postCapa');
    console.log(user);
    let storageRef = this.fb.storage().ref();
    let basePath = '/user/' + this.afAuth.auth.currentUser.uid;
    user.fullPath = basePath + '/' + this.afAuth.auth.currentUser.uid + '.png';
    let uploadTask = storageRef.child(user.fullPath).putString(user.fileToUpload, 'base64');

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        console.log("Em progresso...");
      },
      (error) => {
        console.error(error);
      },
      () => {
        console.log("Upload completo.");
        user.url = uploadTask.snapshot.downloadURL;
        this.afAuth.auth.currentUser.updateProfile({
          displayName:user.nome,
          photoURL: user.url
        });
      });
  }

  getPhoto(){
    console.log('LoginProvider-getPhoto');
    return new Promise(resolve => {
      this.afAuth.authState.subscribe((user: firebase.User) =>{
        resolve((user.photoURL ==undefined)? './assets/images/user.png': user.photoURL);
      });
    });
  }

}
