import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {AuthService} from "./auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showTabs = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const currentRoute = this.router.url;
      this.showTabs = currentRoute !== '/log-in' && currentRoute !== '/register';
    });
  }
  goToUserProfile() {
    this.authService.user.subscribe(user => {
      if (user) {
        const userId = user.id;
        this.router.navigate(['/profile', userId]);
      }
    });
  }
}
