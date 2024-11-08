import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  isLoading=false;
  errorMessage: string = '';

  constructor(private authService:AuthService,private router:Router) { }

  ngOnInit() {
  }

  onLogIn(logInForm: NgForm) {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.logIn(logInForm.value).subscribe({
      next: resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigateByUrl('/home');
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    });
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
