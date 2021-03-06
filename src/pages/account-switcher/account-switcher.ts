import { SwitcherService } from '../../providers/switcherService';
import { Utility } from '../../providers/utility';
import { APIProvider } from '../../providers/APIProvider';
import { LoginPage } from '../login/login';
import { AuthedAccount } from '../../apiClasses/authedAccount';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

/*
  Generated class for the AccountSwitcher page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account-switcher',
  templateUrl: 'account-switcher.html'
})
export class AccountSwitcherPage {
  accounts: AuthedAccount[];
  currentAccount: AuthedAccount;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,
  private modalController: ModalController, private mastodon: APIProvider, private utility: Utility, private switcherService: SwitcherService) {
    this.accounts = JSON.parse(localStorage.getItem('accountList'));
    this.currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
    for(let i = 0; i < this.accounts.length; i++){
      if(!this.accounts[i].fullUsername){
        this.accounts[i].fullUsername = this.getAcct(this.accounts[i]);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountSwitcherPage');
  }

  addAccount(){
    this.navCtrl.push(LoginPage)
  }

  changeAccountTo(account: AuthedAccount){
    console.log(account.mastodonAccount.acct);
    this.mastodon.setCurrentAccount(account);
    this.switcherService.changeAccount(account);
    this.viewCtrl.dismiss();
  }

  removeAccount(account:AuthedAccount){
    let accountList: AuthedAccount[] = JSON.parse(localStorage.getItem('accountList'));
    
    for(let i = 0; i < accountList.length; i++){
      if(accountList[i].accessToken == account.accessToken) {
        accountList.splice(i,1);
        localStorage.setItem('accountList', JSON.stringify(accountList));
        if(accountList.length > 0){
          this.changeAccountTo(accountList[0]);
        } else {
          localStorage.removeItem('currentAccount');
          localStorage.removeItem('accountList');
          this.navCtrl.popAll();
          this.navCtrl.setRoot(LoginPage);
        }
      }
    }
  }


  getAcct(account:AuthedAccount){
    let username = account.mastodonAccount.username;
    let instance = account.instanceUrl;
    instance = instance.substr(instance.lastIndexOf('//')+2)
    return "@" + username + "@" + instance;
  }

}
