import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { ExploreService } from '../feed/explore.service';
import { Feed } from '../feed/feed.model';
import { Router } from '@angular/router';
import { FollowService } from '../follow/follow.service';
import { FollowModel } from '../follow/follow.model';
import {UserService} from "../user/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userId: string | null = null;
  username: string = '';
  fullName: string = '';
  posts: Feed[] = [];
  follows: FollowModel[] = [];
  following: FollowModel[] = [];
  followers = 0;
  followed = 0;
  isLoading = false;
  email: string = '';
  photoUrl: string = '';
  canFollow = true;
  authUserId: string | null = null;

  constructor(
    private authService: AuthService,
    private exploreService: ExploreService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private followService: FollowService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('userId')) {
        this.userId = paramMap.get('userId');
        this.loadUserProfile();
        this.loadUserPosts();
        this.loadFollows();
      }
    });
    this.authService.getUserId().subscribe(userId => {
      this.authUserId = userId;
      if(this.userId === userId)
      this.canFollow = false;
    });
  }

  loadUserProfile() {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(user => {
        if (user) {
          this.username = user.username;
          this.fullName = `${user.name} ${user.surname}`;
          this.email = user.email;
          this.photoUrl = user.photoUrl;
          console.log(this.photoUrl);
        }
      });
    }
  }

  loadUserPosts() {
    if (this.userId) {
      this.isLoading = true;
      this.exploreService.getUserPosts(this.userId).subscribe(posts => {
        this.posts = posts;
        this.isLoading = false;
      });
    }
  }

  loadFollows() {
    if (this.userId) {
      this.isLoading = true;
      this.followService.getfollows(this.userId).subscribe(follows => {
        this.follows = follows;
        this.followers = follows.length;
      });
      this.followService.getfollowing(this.userId).subscribe(following => {
        this.following = following;
        this.followed = following.length;
        this.isLoading = false;
      });
    }
  }

  onDeletePost(postId: string) {
    this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Do you really want to delete this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.loadingCtrl.create({ message: 'Deleting post...' }).then(loadingEl => {
              loadingEl.present();
              this.exploreService.deleteFeed(postId).subscribe(() => {
                loadingEl.dismiss();
                this.loadUserPosts(); // Reload posts after deletion
              });
            });
          }
        }
      ]
    }).then(alertEl => alertEl.present());
  }

  openFeedDetails(feedId: string) {
    this.router.navigate(['/feed-details', feedId]);
  }

  onLogout() {
    this.authService.logOut();
    this.router.navigateByUrl('/log-in').then(() => {
      window.location.reload();
    });
  }
  isAuthUser(): boolean {
    return this.canFollow;
  }

  async onFollow(){
      this.followService.follow(this.authUserId as string, this.userId as string).subscribe(
        async response => {
          console.log('Follow added:', response);
          const alert = await this.alertController.create({
            header: 'Success',
            message: 'You are now following '+ this.username +'!',
            buttons: ['OK']
          });
          await alert.present();
        },
        async error => {
          console.error('Error following:', error);
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'There was an error folowing ' + this.username +'.',
            buttons: ['OK']
          });
          await alert.present();
        }
      );
    }
  }
