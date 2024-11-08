import {Component, Input, OnInit} from '@angular/core';
import {Feed} from "../feed.model";

@Component({
  selector: 'app-feed-element',
  templateUrl: './feed-element.component.html',
  styleUrls: ['./feed-element.component.scss'],
})
export class FeedElementComponent  implements OnInit {
  @Input() feed: Feed = {
    id: 'f1',
    title: 'title',
    description: 'asdasd',
    imageUrl: '',
    userId: 'defaultUserId'
  };
  constructor() { }

  ngOnInit() {}

}
