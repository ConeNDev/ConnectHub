import { Component, OnInit } from '@angular/core';
import { Feed } from "../feed/feed.model";
import { ExploreService } from "../feed/explore.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  feeds: Feed[] = [];
  photoUrl: string = '';
  isLoading: boolean = false;

  constructor(private exploreService: ExploreService, private router: Router) { }

  ngOnInit() {
    // Initial load of feeds
    this.loadFeeds();
  }
  showDetails(id:string){
    this.router.navigate(['/feed-details', id]);
  }
  ionViewDidEnter() {
    // Ensure feeds are loaded when entering the view
    this.loadFeeds();
  }

  loadFeeds() {
    this.isLoading = true;
    this.exploreService.feeds.subscribe(feeds => {
      this.feeds = feeds;
      this.isLoading = false;
    });
  }

  viewPosterProfile(posterId: string) {
    this.router.navigate(['/profile', posterId]);
  }
}
