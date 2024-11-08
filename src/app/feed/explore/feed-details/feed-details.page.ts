import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ExploreService } from '../../explore.service';
import { Feed } from '../../feed.model';
import {FeedEditModalComponent} from "../../../feed-edit-modal/feed-edit-modal.component";
import { AuthService } from 'src/app/auth/auth.service';
import {UserService} from "../../../user/user.service";
import {CommentModel} from "./comment/comment";
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-feed-details',
  templateUrl: './feed-details.page.html',
  styleUrls: ['./feed-details.page.scss'],
})
export class FeedDetailsPage implements OnInit {


  feed!: Feed ;
  feedId!: string;
  isLoading = false;
  userId!: string | null;
  username: string = '';
  photoUrl: string = '';
  canModify = false;
  comments: CommentModel[] = [];
  authUserId: string | null= '';

  constructor(
    private route: ActivatedRoute,
    private exploreService: ExploreService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private modalCtrl: ModalController,
    private authService: AuthService,
  private userService: UserService
  ) {}

  commentForm!: FormGroup;
  ngOnInit() {
    this.commentForm = new FormGroup({
      comment: new FormControl(null, [])
    });
    this.authService.getUserId().subscribe(userId => {
      this.authUserId = userId;
    });
      this.route.paramMap.subscribe(paramMap => {
        const feedId = paramMap.get('feedId');
        if (!feedId) {
          // Ako nema feedId, vrati se na neku drugu stranicu ili pokaži grešku
          this.router.navigate(['/explore']);
          return;
        }
        this.feedId = feedId; // Sada setujemo feedId
        this.isLoading = true;
        this.exploreService.getFeedDetail(this.feedId).subscribe(feed => {
          this.feed = feed;
          this.isLoading = false;

          this.authService.getUserId().subscribe(userId => {
            this.userId = userId;
            if(this.feed.userId === this.userId)
              this.canModify = true;
          });
          this.userService.getUserById(this.feed.userId).subscribe(user => {
            if (user) {
              this.username = user.username;
              this.photoUrl = user.photoUrl;
            }
          });
          this.loadComments(feedId);
        }, error => {
          // Obrada greške ako dođe do greške prilikom dobijanja feed-a
          this.isLoading = false;
          // Možete dodati kod za prikazivanje greške korisniku
        });
      });
    }

  private loadFeedDetails() {
    this.isLoading = true;
    this.exploreService.getFeedDetail(this.feedId).subscribe(feed => {
      this.feed = feed;
      this.isLoading = false;
    });
  }

  onEditFeed() {
    if (!this.feed) {
      return;
    }
    this.modalCtrl.create({
      component: FeedEditModalComponent,
      componentProps: { feed: this.feed }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      if (resultData.role === 'confirm') {
        this.loadingCtrl.create({ message: 'Ažuriranje posta...' }).then(loadingEl => {
          loadingEl.present();
          this.exploreService.editFeed(
            this.feed.id,
            resultData.data.feedData.title,
            resultData.data.feedData.description,
            resultData.data.feedData.imageUrl
          ).subscribe(() => {
            this.feed.title = resultData.data.feedData.title;
            this.feed.description = resultData.data.feedData.description;
            this.feed.imageUrl = resultData.data.feedData.imageUrl;
            loadingEl.dismiss();
          });
        });
      }
    });
  }

  onDeleteFeed() {
    this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Do you really want to delete this feed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.loadingCtrl.create({ message: 'Deleting feed...' }).then(loadingEl => {
              loadingEl.present();
              this.exploreService.deleteFeed(this.feedId).subscribe(() => {
                loadingEl.dismiss();
                this.router.navigateByUrl('/explore');
              });
            });
          }
        }
      ]
    }).then(alertEl => alertEl.present());
  }

  loadComments(feedId: string) {
    this.exploreService.getCommentsByFeedId(feedId).subscribe(comments => {
      console.log(comments.length);
      this.comments = comments;
    });
  }

  onPostComment(){
    const comment = this.commentForm.value.comment;
    console.log("comm " + comment);
    this.exploreService.addComment(this.authUserId as string, this.feedId, comment).subscribe(

    );
  }


  viewPosterProfile(posterId: string) {
    this.router.navigate(['/profile', posterId]);
  }

  canEdit(): boolean {
    return this.canModify;
  }
}
