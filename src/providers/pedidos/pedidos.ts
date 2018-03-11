import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import { AngularFireAuth } from "angularfire2/auth";

@Injectable()
export class PedidosProvider {

  pedidos: FirebaseListObservable<any[]>;

  constructor(
    private db: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private fb: FirebaseApp,) {

    console.log('Hello PedidosProvider Provider');
    let path = '/pedidos/' + this.angularFireAuth.auth.currentUser.uid;

    this.pedidos = db.list(path, {
      query: {
        orderByChild: 'order'
      }
    });

  }

  getAlltPedidos(){
    console.log('PedidosProvider-getAlltPedidos');
    return this.pedidos;

  }

  // postPedido - Método para adicionar pedido
  postPedido(pedido: any){
    console.log('PedidosProvider-postPedido');

    if (pedido.key) {
      return this.pedidos.update(pedido.key, {
        titulo: pedido.titulo,
        descricao: pedido.descricao,
        publico: pedido.publico
      });
    } else {
      return this.pedidos.push({
        titulo: pedido.titulo,
        descricao: pedido.descricao,
        publico: pedido.publico
      });
    }

  }

  // deletePedido - Método para deletar pedido
  deletePedido(pedido: any){
    console.log('PedidosProvider-deletePedido');
    return this.pedidos.remove(pedido.$key);

  }

  publicPedido(pedido: any){
    console.log('PedidosProvider-publicPedido');
    //this.fb.database().ref().child('/oracoes/').
    return this.fb.database().ref().child('/oracoes/').set({
      nome: this.angularFireAuth.auth.currentUser.displayName,
      img: this.angularFireAuth.auth.currentUser.photoURL
    });

  }

  postComentario(pedidKey: any, comentario: any){
    console.log('PedidosProvider-postComentario');
    return this.fb.database().ref().child('/pedidos/' + this.angularFireAuth.auth.currentUser.uid + '/' + pedidKey + '/comentarios/').push({
      comentario: comentario
    });

  }

  setOrder(pedidKey: any, order: any){
    console.log('PedidosProvider-setOrder');
    return this.fb.database().ref().child('/pedidos/' + this.angularFireAuth.auth.currentUser.uid + '/' + pedidKey).update({
      order: order
    });

  }

}
