import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2' ;
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MyApp } from './app.component';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OracoesPage } from "../pages/oracoes/oracoes";
import { PedidosPage } from "../pages/pedidos/pedidos";
import { OracoesProvider } from '../providers/oracoes/oracoes';
import { PedidosProvider } from '../providers/pedidos/pedidos';
import { ToArrayPipe } from "../pipes/klati-filter/klati-filter";
import { PedidoModalPage } from "../pages/pedido-modal/pedido-modal";
import { GruposProvider } from '../providers/grupos/grupos';
import { GruposPage } from "../pages/grupos/grupos";
import { InitialPage } from "../pages/initial/initial";
import { LoginPage } from "../pages/login/login";
import { PerfilPage } from "../pages/perfil/perfil";
import { FIREBASE_CONFIG } from './app.firebase.config';
import { LoginProvider } from '../providers/login/login';
import { SignupPage } from "../pages/signup/signup";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { GrupoModalPage } from "../pages/grupo-modal/grupo-modal";
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { GrupoModalAddPage } from "../pages/grupo-modal-add/grupo-modal-add";
import { ConfigProvider } from '../providers/config/config';
import { GrupoModalViewPage } from "../pages/grupo-modal-view/grupo-modal-view";
import { ComentarioModalPage } from "../pages/comentario-modal/comentario-modal";
import { PopoverPageComponent } from "../components/popover-page/popover-page";
import { PopoverMenuComponent } from "../components/popover-menu/popover-menu";

@NgModule({
  declarations: [
    MyApp,
    OracoesPage,
    PedidosPage,
    GruposPage,
    ToArrayPipe,
    TabsPage,
    InitialPage,
    LoginPage,
    SignupPage,
    PerfilPage,
    PedidoModalPage,
    GrupoModalPage,
    GrupoModalAddPage,
    GrupoModalViewPage,
    ComentarioModalPage,
    PopoverPageComponent,
    PopoverMenuComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OracoesPage,
    PedidosPage,
    GruposPage,
    InitialPage,
    TabsPage,
    PerfilPage,
    LoginPage,
    SignupPage,
    PedidoModalPage,
    GrupoModalPage,
    GrupoModalAddPage,
    GrupoModalViewPage,
    ComentarioModalPage,
    PopoverPageComponent,
    PopoverMenuComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    OracoesProvider,
    PedidosProvider,
    GruposProvider,
    LoginProvider,
    ImagePicker,
    Crop,
    ConfigProvider,
    GooglePlus,
    Facebook
  ]
})
export class AppModule {}
