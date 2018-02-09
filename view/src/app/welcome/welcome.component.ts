import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { DataSharedVarServiceService } from './../service/data-shared-var-service/data-shared-var-service.service';
import { SigninSignupServiceService } from './../service/signin-signup-service/signin-signup-service.service';

import { MatDialog, MatDialogRef } from '@angular/material';
import { AuthService, SocialUser, FacebookLoginProvider } from 'angularx-social-login';

import { FbSignupComponent } from './../popups/fb-signup/fb-signup.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  scrollHeight;
  screenHeight: number;

  email: String = '';
  ShowEmailAlert: Boolean = false;

  user: SocialUser;

  constructor(  public dialog: MatDialog,
                private authService: AuthService,
                private router: Router,
                private Service: SigninSignupServiceService,
                private ShareingService: DataSharedVarServiceService
              ) {}

  ngOnInit() {
    this.ShareingService.SetActiveSinInsignUpTab('', '');
    this.screenHeight = window.innerHeight;
    this.scrollHeight = this.screenHeight + 'px';
  }

  goto(datas) {
    if (datas.status === 'True') {
        this.router.navigate(['Feeds']);
    }else {
      this.Service.EmailValidate(this.user.email).subscribe( newdatas => { this.gotoEmailAnalyze(newdatas); } );
    }
  }

  gotoEmailAnalyze(newdatas: any) {
    if (newdatas.available === 'False') {
      alert('Your Facebook E-mail Already Registerd! please SignIn.');
      this.authService.signOut();
      this.ShareingService.SetActiveSinInsignUpTab('SingIn', this.user.email);
      this.router.navigate(['SignInSignUp']);
    }else {
      this.FbSignUp();
    }
  }

  FbSignUp() {
    const FbSignUpDialogRef = this.dialog.open( FbSignupComponent,
      { disableClose: true, minWidth: '40%', position: {top: '50px'},  data: { Type: 'Facebook', Values: this.user } });
      FbSignUpDialogRef.afterClosed().subscribe(result => this.FbSignUpComplete(result));
  }

  FbSignUpComplete(result) {
    if (result === 'Success') {
      this.router.navigate(['Feeds']);
    }else {
      this.authService.signOut();
    }
  }


  signInWithFB(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      if ( this.user !== null ) {
        this.Service.FBUserValidate(this.user.email, this.user.id)
            .subscribe( datas => { this.goto(datas); } );
      }
    });
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  // signOut(): void {
  //   this.authService.signOut();
  // }


  gotoNext(email: string) {
    if (email.length >= 6 ) {
      this.Service.EmailValidate(email).subscribe( datas => { this.gotoAnalyze(datas); } );
    }else {
      this.ShowEmailAlert = true;
      setTimeout(() => { this.ShowEmailAlert = false; }, 5000);
    }
  }

  gotoAnalyze(datas: any) {
    if (datas.status === 'True') {
      if (datas.available === 'False') {
        this.ShareingService.SetActiveSinInsignUpTab('SingIn', this.email);
        this.router.navigate(['SignInSignUp']);
      }else {
        this.ShareingService.SetActiveSinInsignUpTab('SignUp', this.email);
        this.router.navigate(['SignInSignUp']);
      }
    }else {
      this.ShareingService.SetActiveSinInsignUpTab('SignUp');
      this.router.navigate(['SignInSignUp']);
    }
  }
  gotoSignUp(email: string) {
    this.ShareingService.SetActiveSinInsignUpTab('SignUp');
    this.router.navigate(['SignInSignUp']);
  }
  gotoSignIn(email: string) {
    this.ShareingService.SetActiveSinInsignUpTab('SingIn');
    this.router.navigate(['SignInSignUp']);
  }


}
