import { Component, Input, OnInit } from '@angular/core';
import { CommentModel} from "./comment";
import {UserService} from "../../../../user/user.service";
import {FeedDetailsPage} from "../feed-details.page";
import {UserModelModel} from "../../../../user/user.model";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})

export class CommentComponent implements OnInit {
  @Input() comment!: CommentModel;
  @Input() text: string = '';
  userId: string | null = null;
  feedId : string = "";
  username:string = "";
  photoUrl: string = "";

  public userC!: UserModelModel;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserById(this.comment.uid).subscribe(user => {
      this.userC = user as UserModelModel;
    });
  }
}
