import { Injectable } from '@angular/core';
import {CanLoad, Route, Router, UrlSegment, UrlTree} from '@angular/router';
import {Observable, take, tap} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService:AuthService,private router:Router) {
  }
  //canLoad se sam poziva pre lazyloadinga tako da na samom pocetku se ova metoda poziva
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //ovaj guard smo napravili da sluzi da ako npr smo na log-in stranici da nam ne da da ukucamo u url /feed i da nas
    //odvede na pocetnu feed stranicu a da se pritom nismo ulogovali zato ga implementiramo ovde
    return this.authService.isUserAuthenticated.pipe(
      take(1),
      tap(isAuthenticated=>{
        if(!isAuthenticated){
          this.router.navigateByUrl('log-in')
        }
      }))

    if(!this.authService.isUserAuthenticated){
      this.router.navigateByUrl('/log-in');
    }
    return this.authService.isUserAuthenticated;
  }
}
