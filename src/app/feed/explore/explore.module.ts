import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExplorePageRoutingModule } from './explore-routing.module';

import { ExplorePage } from './explore.page';
import {FeedElementComponent} from "../feed-element/feed-element.component";
import {FeedModalComponent} from "../feed-modal/feed-modal.component";

// @ts-ignore
// @ts-ignore
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExplorePageRoutingModule,
  ],
  declarations: [ExplorePage,FeedElementComponent,FeedModalComponent],
  //entryComponents: [FeedModalComponent]
})
export class ExplorePageModule {}
