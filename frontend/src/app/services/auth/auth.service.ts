/* eslint-disable quote-props */
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TOKEN_KEY, BACKEND_ANDROID_SERVER, BACKEND_SERVER } from 'src/app/constants';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);
  private isAuthenticated = new BehaviorSubject(false);

  constructor(private storage: Storage, private http: HttpClient, private plt: Platform, private router: Router) {
    this.loadStoredToken();
  }

   loadStoredToken() {
    const platformObs = from(this.plt.ready());

    this.user = platformObs.pipe(
      switchMap(() => from(this.storage.get(TOKEN_KEY))),
      map(token => {
        if (token) {
          const decoded = helper.decodeToken(token);
          this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }

  login(credentials: {username: string; email: string; password: string }) {
    const postData = {
      'username': credentials.username,
      'email': credentials.email,
      'password' : credentials.password
    };

    return this.http.post(`${BACKEND_ANDROID_SERVER}/auth/login`, postData).pipe(
      take(1),
      // eslint-disable-next-line @typescript-eslint/dot-notation
      map(res => res['token']),
      switchMap(token => {
        const decoded = helper.decodeToken(token);
        this.userData.next(decoded);

        this.isAuthenticated.next(true);

        const storageObs = from(this.storage.set(TOKEN_KEY, token));
        return storageObs;
      })
    );
  }

  register(credentials: {username: string; email: string; password: string }) {
    const postData = {
      'username': credentials.username,
      'email': credentials.email,
      'password' : credentials.password
    };

    return this.http.post(`${BACKEND_ANDROID_SERVER}/auth/register`, postData);

  }

  getUser() {
    return this.userData.getValue();
  }

  getisAuthenticated() {
    return this.isAuthenticated.asObservable();
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
      this.isAuthenticated.next(false);
    });
  }

}
