
/*
  Class do object Pedido
*/

export class Pedido {

  key: number;
  titulo: string;
  descricao: string;
  publico: boolean;
  prioridade: boolean;

  constructor(){
  }

  public setPedCod(key: number){
    this.key = key;
  }

}
