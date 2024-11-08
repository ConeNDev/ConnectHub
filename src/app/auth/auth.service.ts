import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {environment} from "../../environments/environment";
import {User} from "./user.model";
import {BehaviorSubject, map, tap, Observable, of} from "rxjs";
import {Router} from "@angular/router";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap, take } from 'rxjs/operators';
import { UserModelModel } from '../user/user.model';

interface UserData {
  name: string;
  surname: string;
  username: string;
  email: string;
  password:string;
}




interface AuthResponseData{
  kind:string,
  idToken:string,
  email: string,
  refreshToken:string,
  localId:string,
  expiresIn:string,
  registered?:boolean
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private _users = new BehaviorSubject<UserModelModel[]>([]);
  userr: Observable<any>;
  private baseUrl = 'https://connecthub-mobile-computing-default-rtdb.europe-west1.firebasedatabase.app';
  private _isUserAuthenticated=false;

  private registeredID!: string;

  private _user=new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient,private router: Router,private afAuth: AngularFireAuth, private afs: AngularFirestore) {this.userr = this.afAuth.authState.pipe(
    switchMap(userr => {
      if (userr) {
        return this.afs.doc(`users/${userr.uid}`).get();
      } else {
        return of(null);
      }
    })
  ); }
  get users() {
    return this._users.asObservable();
  }

  getUserPosts(userId: string) {

  }



  register(user:UserData) {
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      {email: user.email, password: user.password, returnSecureToken: true}).pipe(
      tap((userData)=>{
        const expirationTime=new Date(new Date().getTime()+ +userData.expiresIn*1000);
        const user=new User(userData.localId,userData.email,userData.idToken,expirationTime);
        this._user.next(user);
        this.registeredID = userData.localId;
      }));
  }






  get user() {
    return this._user.asObservable();
  }
  get isUserAuthenticated(){
    return this._user.asObservable().pipe(map((user)=>{
      if(user){
        return !!user.token;
      }
      else{
        return false;
      }
    }))
  }
  get userId(){
    return this._user.asObservable().pipe(map((user)=>{
      if(user){
        return user.id;
      }
      else{
        return null;
      }
    }))
  }
  getUserId(): Observable<string | null> {
    return this.userId;
  }
  setUser(user: User) {
    this._user.next(user);
  }

  get email() {
    return this._user.asObservable().pipe(map(user => user ? user.email : ''));
  }


  getToken(){
    return this._user.asObservable().pipe(map((user)=>{
      if(user){
        return user.token;
      }
      else{
        return null;
      }
    }))
  }
  logIn(user:UserData){

    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      {email: user.email, password: user.password, returnSecureToken: true})
      .pipe(
        tap((userData)=>{
          const expirationTime=new Date(new Date().getTime()+ +userData.expiresIn*1000);
          const user=new User(userData.localId,userData.email,userData.idToken,expirationTime);
          this._user.next(user);
        }));
    this._isUserAuthenticated = true;
  }
  logOut(){
    this._user.next(null);
  }
}
