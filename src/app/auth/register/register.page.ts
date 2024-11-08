import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {AlertController, LoadingController} from '@ionic/angular';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {UserService} from "../../user/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;
  constructor(private authService: AuthService,private userService: UserService,private loadingCtrl: LoadingController,private router:Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(7)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      photoUrl: new FormControl(null, []),
    });
  }
  onRegister(){
    this.loadingCtrl.create({message:"Registering..."}).then((loadingEl)=>{
      loadingEl.present();
      this.authService.register(this.registerForm.value).subscribe(resData=>{
        console.log(resData);
        loadingEl.dismiss();
        this.router.navigateByUrl('/explore')
        this.addUser();
      });

    })


  }

  addUser() {
    const uid = '12345';
    const email = this.registerForm.value.email;
    const name = this.registerForm.value.name;
    const surname = this.registerForm.value.surname;
    const username = this.registerForm.value.username;
    const photoUrl = this.registerForm.value.photoUrl; // Optional

    this.userService.addUserDetail(uid, email, name, surname, username, photoUrl).subscribe(
      () => {
        console.log('User added successfully');
        // Handle success or navigate to another page
      },
      error => {
        console.error('Error adding user:', error);
        // Handle error
      }
    );
  }
}
