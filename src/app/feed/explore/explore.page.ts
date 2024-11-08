import { Component, OnInit } from '@angular/core';
import { Feed } from '../feed.model';
import { ExploreService } from '../explore.service';
import {ModalController} from "@ionic/angular";
import {FeedModalComponent} from "../feed-modal/feed-modal.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  feeds: Feed[] = [];

  constructor(private exploreService: ExploreService, private modalCtrl:ModalController,private router: Router) {}

  ngOnInit() {
    this.exploreService.feeds.subscribe(feeds => {
      this.feeds = feeds;
    });
  }

  ionViewWillEnter() {
    this.exploreService.getFeedDetails().subscribe();
  }

  openModal() {
    this.modalCtrl.create({
      component: FeedModalComponent,
      componentProps: { title: 'Add post' }
    }).then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(resultData => {
      if (resultData.role === 'confirm') {
        this.exploreService.addFeedDetail(resultData.data.feedData.description,
          resultData.data.feedData.imageUrl, resultData.data.feedData.title).subscribe();
      }
    });
  }
  openFeedDetails(feedId: string) {
    this.router.navigate(['/feed-details', feedId]);
  }
}
