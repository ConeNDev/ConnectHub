import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PublishPostPageRoutingModule } from './publish-post-routing.module';
import { PublishPostPage } from './publish-post.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PublishPostPageRoutingModule
  ],
  declarations: [PublishPostPage]
})
export class PublishPostPageModule {}
