import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from "angularfire2/auth";
import { FirebaseApp } from 'angularfire2';
import {  ToastController } from 'ionic-angular';
import * as firebase from 'firebase';

@Injectable()
export class GruposProvider {

  grupos: FirebaseListObservable<any[]>;
  allGrupos: FirebaseListObservable<any[]>;

  constructor(
    private db: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private fb: FirebaseApp,
    public toastCtrl: ToastController
  ) {
    console.log('Hello GruposProvider Provider');
    let path = '/grupos/' + this.angularFireAuth.auth.currentUser.uid;

    this.grupos = db.list(path, {
      query: {
        orderByChild: 'nome'
      }
    });
  }

  // Método para pegar os grupos disponíveis
  public getGrupos() {
    console.log('GruposProvider-getGrupos');
    return this.grupos;
  }

  public postGrupo(grupo: any) {
    console.log('GruposProvider-postPedido');
    console.log(grupo);
    if (grupo.key) {
      return this.grupos.update(grupo.$key, {
        keyAllGrupos: grupo.keyAllGrupos,
        nome: grupo.nome,
        descricao: grupo.descricao,
        privado: grupo.privado,
        localidade: grupo.localidade,
        modo: grupo.modo,
        url: grupo.url
      }).catch(error => {
        console.error('Erro no update de grupo' + error);
      });
    } else {
      return this.grupos.set(grupo.keyAllGrupos, {
        keyAllGrupos: grupo.keyAllGrupos,
        nome: grupo.nome,
        descricao: grupo.descricao,
        privado: grupo.privado,
        localidade: grupo.localidade,
        modo: grupo.modo,
        url: grupo.url
      }).catch(error => {
        console.error('Erro no push de grupo' + error);
      });
    }
  }

  public getAllGrupos() {
    console.log('GruposProvider-getAllGrupos');
    return this.db.list('/allGrupos/', {
      query: {
        orderByChild: 'privado',
        equalTo: false
      }
    });
  }

  public createAllGruposAndGrupo(grupo: any) {
    console.log('GruposProvider-createAllGruposAndGrupo');
    console.log(grupo);

    // Reserva um key para update
    grupo.keyAllGrupos = this.fb.database().ref().child('/allGrupos/').push().key;

    return this.fb.database().ref().child('/allGrupos/' + grupo.keyAllGrupos).update({
      nome: grupo.nome,
      descricao: grupo.descricao,
      localidade: grupo.localidade,
      privado: grupo.privado,
      modo: grupo.modo,
      url: grupo.url
    }).then(data => {
      if (grupo.fileToUpload != undefined) {
        this.postCapa(grupo);
      } else {
        this.postGrupo(grupo);
      }
      this.postParticipante(grupo.keyAllGrupos, true);
    })
      .catch(error => {
        console.error('Erro no update de allGrupos' + error);
      });
  }

  public updateAllGruposAndGrupo(grupo: any) {
    console.log('GruposProvider-updateAllGruposAndGrupo');
    console.log(grupo);

    return this.fb.database().ref().child('/allGrupos/' + grupo.keyAllGrupos).update({
      nome: grupo.nome,
      descricao: grupo.descricao,
      localidade: grupo.localidade,
      privado: grupo.privado,
      modo: grupo.modo,
      url: grupo.url
    }).then(data => {
      if (grupo.fileToUpload != undefined && grupo.url != undefined) {
        this.postCapa(grupo);
      } else {
        this.postGrupo(grupo);
      }
      this.postParticipante(grupo.keyAllGrupos, true);
    })
      .catch(error => {
        console.error('Erro no update de allGrupos' + error);
      });
  }

  public postCapa(grupo: any) {
    console.log('GruposProvider-postCapa');
    let storageRef = this.fb.storage().ref();
    let basePath = '/allGrupos/' + grupo.keyAllGrupos;
    grupo.fullPath = basePath + '/' + grupo.nome + '.png';
    let uploadTask = storageRef.child(grupo.fullPath).putString(grupo.fileToUpload, 'base64');

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        //var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Em progresso...");
      },
      (error) => {
        console.error(error);
      },
      () => {
        console.log("Upload completo.");
        grupo.url = uploadTask.snapshot.downloadURL;
        this.fb.database().ref().child('/allGrupos/' + grupo.keyAllGrupos).update({
          fullPath: grupo.fullPath,
          url: grupo.url
        });
        this.postGrupo(grupo);
      });
  }

  public removeFile(fullPath: string) {
    console.log('PedidosProvider-postCapa');
    let storageRef = this.fb.storage().ref();
    storageRef.child(fullPath).delete();
  }

  public seachAllGrupos(nome: string) {
    return this.db.list('/allGrupos/', {
      query: {
        orderByChild: 'privado',
        equalTo: false,
        indexOn: 'privado'
      }
    }).map(allGrupos => {
      return allGrupos.filter(grupo => grupo.nome.includes(nome));
    });
  }

  public async seachGrupo(grupo: any) {
    console.log('GruposProvider-addGrupo');

    return this.db.list('/grupos/' + this.angularFireAuth.auth.currentUser.uid, {
      query: {
        orderByChild: 'nome'
      }
    }).map(gruposParticipante => {
      return gruposParticipante.filter(grupoParticipante => grupoParticipante.$key == grupo.$key);
    });

  }

  public deletGrupo(grupoKey: string) {
    console.log('GruposProvider-deletGrupo');
    this.grupos.remove(grupoKey);
  }

  public getParticipantes(grupoKey: string) {
    console.log('GruposProvider-getParticipantes');
    return this.db.list('/grupoParticipantes/' + grupoKey, {
      query: {
        orderByChild: 'nome'
      }
    });
  }

  public async deletParticipante(grupoKey: string, userKey ?: string){
    console.log('GruposProvider-deletParticipante');
    let url = (userKey)? '/grupoParticipantes/' + grupoKey + '/' + userKey : '/grupoParticipantes/' + grupoKey + '/' + this.angularFireAuth.auth.currentUser.uid;
    return this.fb.database().ref().child(url).remove();
  }

  public async doAdministrador(grupoKey: string, userKey ?: string){
    console.log('GruposProvider-doAdministrador');
    let url = (userKey)? '/grupoParticipantes/' + grupoKey + '/' + userKey : '/grupoParticipantes/' + grupoKey + '/' + this.angularFireAuth.auth.currentUser.uid;
    return this.fb.database().ref().child(url).update({
      adm: true
    });
  }

  public getParticipanteAdm(grupoKey: string) {
    console.log('GruposProvider-getParticipanteAdm');
    return this.db.list('/grupoParticipantes/' + grupoKey, {
      query: {
        orderByChild: 'nome'
      }
    }).map(allParticipantes => {
      return allParticipantes.filter( Participante =>
        Participante.$key == this.angularFireAuth.auth.currentUser.uid);
    });
  }

  public postParticipante(grupoKey: string, adm: boolean) {
    console.log('GruposProvider-postParticipante');
    return this.fb.database().ref().child('/grupoParticipantes/' + grupoKey +'/' + this.angularFireAuth.auth.currentUser.uid).set({
      //key: this.angularFireAuth.auth.currentUser.uid,
      nome: this.angularFireAuth.auth.currentUser.displayName,
      img: this.angularFireAuth.auth.currentUser.photoURL,
      adm: adm
    });
  }

  public validatAndSave(participantes: any, grupo : any ) {
    console.log('GruposProvider-validatAndSave');
    let mensagem;

    switch (participantes.length) {
          case 0:
            mensagem = 'Grupo adicionado!';
            grupo.keyAllGrupos = grupo.$key;
            grupo.key = false;
            this.postGrupo(grupo);
            this.postParticipante(grupo.keyAllGrupos, false);
            break;

          case 1:
            mensagem = 'Você já faz parte do grupo!';
            break;

          default:
             mensagem = null;
            break;
        }

        let toast = this.toastCtrl.create({
          message: mensagem,
          duration: 3000
        });
        toast.present();

  }

  public doSortearGrupo(participantes: any, grupoKey: string) {
    console.log('GruposProvider-doSortearGrupo');
    let numRand =  (participantes.length % 2 ==0)? (participantes.length/2) : ((participantes.length - 1) /2);
    let mensagem = '';

    if (numRand >= 2) {
      //participante recebi número randômico
      for (let i=0; i < participantes.length; i++) {
        participantes[i].order = Math.random();
      }
      //orderna lista a partir do número
      participantes.sort(($a, $b) =>  {
        return $a['order'] - $b['order'];
      });
      //Atribui o participantes de oração
      for (let i=0; i < participantes.length; i++) {
        if(i< numRand){
          participantes[i].prayfor = participantes[i + numRand].$key;
        }else{
          participantes[i].prayfor = participantes[i - numRand].$key;
        }
      }
      //Update no banco
      for(let i=0; i < participantes.length; i++){
        this.fb.database().ref().child('/grupoParticipantes/' + grupoKey +'/' + participantes[i].$key ).update({
          prayfor: participantes[i].prayfor
        }).catch( error =>
          console.log('erro update prayfor')
        );
      }
      mensagem = "Cada participante recebeu um novo PrayFor!";
    } else {
      mensagem = "Ops! Necessário mais participantes para sortear!";
    }

    let toast = this.toastCtrl.create({
      message: mensagem,
      duration: 3000
    });
    toast.present();
  }

}
