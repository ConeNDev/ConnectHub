import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { FollowModel } from './follow.model';

interface FollowData {
  followerId: string;
  followedId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private _follows = new BehaviorSubject<FollowModel[]>([]);
  private baseUrl = 'https://connecthub-mobile-computing-default-rtdb.europe-west1.firebasedatabase.app';

  get follows() {
    return this._follows.asObservable();
  }
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  follow(followerId:string, followedId: string) {
    let generatedId: string;
    let newFollow: FollowModel;
    let fetchedUserId: string | null;

    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.getToken();
      }),
      take(1),
      switchMap(token => {
        newFollow = new FollowModel(
          followerId,
          followedId
        );
        return this.http.post<{ name: string }>(
          `${this.baseUrl}/follows.json?auth=${token}`,
          { ...newFollow, id: null }
        );
      }),
      take(1),
      switchMap(resData => {
        generatedId = resData.name;
        return this.follows;
      }),
      take(1),
      tap(follows => {
        this._follows.next(follows.concat(newFollow));
      })
    );
  }

  getfollows(userId: string) {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: FollowData }>(
          `${this.baseUrl}/follows.json?auth=${token}`);
      }),
      map(followsData => {

        const follows: FollowModel[] = [];
        for (const key in followsData) {

          if(followsData[key].followedId == userId)
          if (followsData.hasOwnProperty(key)) {
            follows.push(new FollowModel(
              followsData[key].followerId,
              followsData[key].followedId,
            ));
          }
        }
        return follows;
      })
    );
  }

  getfollowing(userId: string) {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: FollowData }>(
          `${this.baseUrl}/follows.json?auth=${token}`);
      }),
      map(followsData => {

        const follows: FollowModel[] = [];
        for (const key in followsData) {

          if(followsData[key].followerId == userId)
          if (followsData.hasOwnProperty(key)) {
            follows.push(new FollowModel(
              followsData[key].followerId,
              followsData[key].followedId,
            ));
          }
        }
        return follows;
      })
    );
  }
}
