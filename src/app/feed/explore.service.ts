import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feed } from './feed.model';
import { BehaviorSubject, catchError, map, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import {CommentModel} from "./explore/feed-details/comment/comment";

interface FeedData {
  title: string;
  description: string;
  imageUrl: string;
  userId: string;
}

interface CommentData {
  uid:string,
  feedId :string,
  text:string
}

@Injectable({
  providedIn: 'root'
})
export class ExploreService {
  private _feeds = new BehaviorSubject<Feed[]>([]);
  private baseUrl = 'https://connecthub-mobile-computing-default-rtdb.europe-west1.firebasedatabase.app';

  private _comments = new BehaviorSubject<CommentModel[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {}

  get feeds() {
    return this._feeds.asObservable();
  }

  get comments() {
    return this._comments.asObservable();
  }

  addFeedDetail(description: string, imageUrl: string, title: string) {
    let generatedId: string;
    let newFeed: Feed;
    let fetchedUserId: string | null;

    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.getToken();
      }),
      take(1),
      switchMap(token => {
        newFeed = new Feed(
          '', // privremeni id dok ne dobijemo pravi id od Firebase-a
          title,
          description,
          imageUrl,
          fetchedUserId!
        );
        return this.http.post<{ name: string }>(
          `${this.baseUrl}/feeds.json?auth=${token}`,
          { ...newFeed, id: null }
        );
      }),
      take(1),
      switchMap(resData => {
        generatedId = resData.name;
        return this.feeds;
      }),
      take(1),
      tap(feeds => {
        newFeed.id = generatedId;
        this._feeds.next(feeds.concat(newFeed));
      })
    );
  }

  getFeedDetails() {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: FeedData }>(
          `${this.baseUrl}/feeds.json?auth=${token}`
        );
      }),
      map(feedsData => {
        const feeds: Feed[] = [];
        for (const key in feedsData) {
          if (feedsData.hasOwnProperty(key)) {
            feeds.push(new Feed(
              key,
              feedsData[key].title,
              feedsData[key].description,
              feedsData[key].imageUrl,
              feedsData[key].userId
            ));
          }
        }
        return feeds;
      }),
      tap(feeds => {
        this._feeds.next(feeds);
      })
    );
  }

  getFeedDetail(id: string) {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<FeedData>(
          `${this.baseUrl}/feeds/${id}.json?auth=${token}`
        ).pipe(
          map(feedData => {
            return new Feed(
              id,
              feedData.title,
              feedData.description,
              feedData.imageUrl,
              feedData.userId
            );
          })
        );
      })
    );
  }

  getUserPosts(userId: string) {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: FeedData }>(
          `${this.baseUrl}/feeds.json?auth=${token}`);
      }),
      map(feedsData => {

        const feeds: Feed[] = [];
        for (const key in feedsData) {

          if(feedsData[key].userId == userId)
          if (feedsData.hasOwnProperty(key)) {
            feeds.push(new Feed(
              key,
              feedsData[key].title,
              feedsData[key].description,
              feedsData[key].imageUrl,
              feedsData[key].userId
            ));
          }
        }
        return feeds;
      })
    );
  }

  addComment(uid: string, feedId: string, comment: string) {
    let generatedId: string;
    let newComment: CommentModel;
    let fetchedUserId: string | null;

    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.getToken();
      }),
      take(1),
      switchMap(token => {
        newComment = new CommentModel(
          uid,
          feedId,
          comment
        );
        return this.http.post<{ name: string }>(
          `${this.baseUrl}/comments.json?auth=${token}`,
          { ...newComment, id: null }
        );
      }),
      take(1),
      switchMap(resData => {
        generatedId = resData.name;
        return this.comments;
      }),
      take(1),
      tap(comments => {
        this._comments.next(comments.concat(newComment));
      })
    );
  }

  getCommentsByFeedId(feedId: string) {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: CommentData }>(
          `${this.baseUrl}/comments.json?auth=${token}`);
      }),
      map(commentsData => {

        const comments: CommentModel[] = [];
        for (const key in commentsData) {

          if(commentsData[key].feedId == feedId)
            if (commentsData.hasOwnProperty(key)) {
              comments.push(new CommentModel(
                commentsData[key].uid,
                commentsData[key].feedId,
                commentsData[key].text
              ));
            }
        }
        return comments;
      })
    );
  }

  editFeed(id: string, title: string, description: string, imageUrl: string) {
    let updatedFeeds: Feed[];
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.put(
          `${this.baseUrl}/feeds/${id}.json?auth=${token}`,
          { title, description, imageUrl }
        );
      }),
      switchMap(() => this.feeds),
      take(1),
      tap(feeds => {
        const updatedFeedIndex = feeds.findIndex(f => f.id === id);
        updatedFeeds = [...feeds];
        updatedFeeds[updatedFeedIndex] = new Feed(id, title, description, imageUrl, feeds[updatedFeedIndex].userId);
        this._feeds.next(updatedFeeds);
      })
    );
  }

  deleteFeed(id: string) {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.delete(
          `${this.baseUrl}/feeds/${id}.json?auth=${token}`
        ).pipe(
          catchError(error => {
            console.error('Error deleting feed:', error);
            return of(null); // Vrati null u slučaju greške
          })
        );
      }),
      switchMap(() => this.feeds),
      take(1),
      tap(feeds => {
        this._feeds.next(feeds.filter(f => f.id !== id));
      })
    );
  }
}
