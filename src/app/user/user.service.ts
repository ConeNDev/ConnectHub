import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {UserModelModel} from "./user.model";
import {switchMap, take} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {User} from "../auth/user.model";
import {AuthService} from "../auth/auth.service";

interface UserModelModelData {
  uid: string,
  email:string,
  name:string,
  surname:string,
  username:string,
  photoUrl:string
}




@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,private router: Router, private authService: AuthService) { }


  private _users = new BehaviorSubject<UserModelModel[]>([]);
  private _user=new BehaviorSubject<User | null>(null);

  private baseUrl = 'https://connecthub-mobile-computing-default-rtdb.europe-west1.firebasedatabase.app';

  private registeredID!: string;

  getUserById(userId: string): Observable<UserModelModel | null> {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: UserModelModel }>(
          `${this.baseUrl}/users.json?auth=${token}`);
      }),
      map(usersData => {

        const users: UserModelModel[] = [];
        for (const key in usersData) {

          if(usersData[key].uid == userId)
            if (usersData.hasOwnProperty(key)) {
              return new UserModelModel(
                usersData[key].uid,
                usersData[key].email,
                usersData[key].name,
                usersData[key].surname,
                usersData[key].username,
                usersData[key].photoUrl
              );
            }
        }
        return null;
      })
    );
  }


  addUserDetail(uid: string, email: string, name: string, surname: string, username: string, photoUrl: string): Observable<any> {
    let generatedId: string;
    let newUser: UserModelModel;
    let fetchedUserId: string | null;


    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.getToken();
      }),
      take(1),
      switchMap(token => {
        newUser = new UserModelModel(
          this.registeredID, // privremeni id dok ne dobijemo pravi id od Firebase-a
          email,
          name,
          surname,
          username,
          photoUrl
        );
        return this.http.post<{ name: string }>(
          `${this.baseUrl}/users.json?auth=${token}`,
          { ...newUser, id: null }
        );
      }),
      take(1),
      switchMap(resData => {
        generatedId = resData.name;
        return this.authService.users;
      }),
      take(1),
      tap(feeds => {
        newUser.uid = generatedId;
        this._users.next(feeds.concat(newUser));
      })
    );

  }
}
