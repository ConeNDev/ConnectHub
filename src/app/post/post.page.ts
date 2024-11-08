import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import {ExploreService} from "../feed/explore.service";


@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  postForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private exploreService: ExploreService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  async onSubmit() {
    if (this.postForm.valid) {
      const { title, description, imageUrl } = this.postForm.value;
      this.exploreService.addFeedDetail(description, imageUrl, title).subscribe(
        async response => {
          console.log('Feed added:', response);
          this.postForm.reset();
          const alert = await this.alertController.create({
            header: 'Success',
            message: 'Feed successfully added!',
            buttons: ['OK']
          });
          await alert.present();
        },
        async error => {
          console.error('Error adding feed:', error);
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'There was an error adding the feed.',
            buttons: ['OK']
          });
          await alert.present();
        }
      );
    }
  }
}
