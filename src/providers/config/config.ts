import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

let config_key = "config";

@Injectable()
export class ConfigProvider {

  constructor() {
    console.log('Hello ConfigProvider Provider');
  }

  private config = {
    showSlide: false,
    loginKeep: false,
    user_email: "",
    user_senha: ""
  }

  public getConfigData(): any {
    return localStorage.getItem(config_key);
  }

  public setConfigDate(
    showSlide?: boolean,
    loginKeep?: boolean,
    user_email?: string,
    user_senha?: string) {
    let config = {
      showSlide: false,
      loginKeep: false,
      user_email: "",
      user_senha: ""
    }

    // Apresenta Slide
    if (showSlide) {
      config.showSlide = showSlide;
    }

    // Manter logado
    if (loginKeep) {
      config.loginKeep = loginKeep;
      config.user_senha = user_senha;
    }

    // E-mail user
    if (user_email != undefined) {
      config.user_email = user_email;
    }

    localStorage.setItem(config_key, JSON.stringify(config));
  }

}
