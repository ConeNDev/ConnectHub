import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-feed-modal',
  templateUrl: './feed-modal.component.html',
  styleUrls: ['./feed-modal.component.scss'],
})
export class FeedModalComponent  implements OnInit {
  @ViewChild('f',{static: true}) form!: NgForm;
  @Input()title!: string;
  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {

  }

  onCancel(){
    this.modalCtrl.dismiss();
  }
  onAddPost(){
    if(!this.form.valid){
      return;
    }
    this.modalCtrl.dismiss({
      feedData:
        {imageUrl: this.form.value['imageUrl'],
        description: this.form.value['description'],
        title:this.form.value['title']
        }
      },
      'confirm');
  }

}
