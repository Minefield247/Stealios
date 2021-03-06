import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WakoCacheService } from '@wako-app/mobile-sdk';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss'],
})
export class DisclaimerComponent {
  constructor(public modalController: ModalController) {}

  checkIt() {
    WakoCacheService.set('disclaimer-accepted', true, '3m').then(() => {
      this.modalController.dismiss();
    });
  }
}
