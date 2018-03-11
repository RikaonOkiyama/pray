import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from "../pages/login/login";
import { InitialPage } from "../pages/initial/initial";
import { ConfigProvider } from "../providers/config/config";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    configProvider: ConfigProvider) {
    platform.ready().then(() => {
      let config = configProvider.getConfigData();
      if (config == null) {
        this.rootPage = InitialPage;
        configProvider.setConfigDate(false);
      } else {
        this.rootPage = LoginPage;
        //configProvider.setConfigDate(false);
      }
      console.log(config);
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
