import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from "angularfire2/auth";
import { FirebaseApp } from 'angularfire2';
import 'rxjs/add/operator/map';

@Injectable()
export class OracoesProvider {

  constructor(
    private db: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private fb: FirebaseApp) {
    console.log('Hello OracoesProvider Provider');
  }

  // Método para busca todas as orações disponiveis para o usuário
  getAlltOracoes() {
    console.log('OracoesProvider-getAlltOracoes');

    return this.db.list('/oracoes/' + this.angularFireAuth.auth.currentUser.uid, {
      query: {
        orderByChild: 'nome'
      }
    });

  }

  public async postOracao(grupoKey: number, prayuid: number, oracaoKey: number) {
    console.log('OracoesProvider-postOracao');
    return this.fb.database().ref().child(
      '/oracoes/' + this.angularFireAuth.auth.currentUser.uid + '/' + grupoKey + '/prays/' + oracaoKey + '/prayfor' ).push({
      grupoKey: grupoKey,
      uid: this.angularFireAuth.auth.currentUser.uid,
      time: new Date().toISOString()
    });
  }

  public postOracaoPedidos(grupoKey: number, prayuid: number, oracaoKey: number) {
    console.log('OracoesProvider-postOracao');
    return this.fb.database().ref().child('/pedidos/' + prayuid + '/' + oracaoKey + '/prayfor' ).push({
      grupoKey: grupoKey,
      uid: this.angularFireAuth.auth.currentUser.uid,
      time: new Date().toISOString()
    });
  }

}
