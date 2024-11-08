import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Feed} from "../feed/feed.model";


@Component({
  selector: 'app-feed-edit-modal',
  templateUrl: './feed-edit-modal.component.html',
  styleUrls: ['./feed-edit-modal.component.scss'],
})
export class FeedEditModalComponent implements OnInit {
  @Input() feed!: Feed;
  form!: FormGroup;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(this.feed.title, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(this.feed.description, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      imageUrl: new FormControl(this.feed.imageUrl, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onEditFeed() {
    if (!this.form.valid) {
      return;
    }
    this.modalCtrl.dismiss({
      feedData: {
        title: this.form.value.title,
        description: this.form.value.description,
        imageUrl: this.form.value.imageUrl
      }
    }, 'confirm');
  }
}
