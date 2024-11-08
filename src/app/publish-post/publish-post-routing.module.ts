import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublishPostPage } from './publish-post.page';

const routes: Routes = [
  {
    path: '',
    component: PublishPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublishPostPageRoutingModule {}
