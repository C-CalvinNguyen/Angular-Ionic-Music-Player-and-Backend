import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.scss'],
})
export class RightMenuComponent implements OnInit {

  // Variables (to check if user is logged in)
  user: any = null;

  // constructor calls authService to check if user is logged in
  // If user is logged in change right-menu options
  constructor(private menu: MenuController, private authService: AuthService) {
    this.authService.getisAuthenticated().subscribe(data => {
      this.user = data;
    });
  }

  ngOnInit() {}

  // Used to open menu from right side (end)
  openEnd() {
    this.menu.enable(true, 'end');
    this.menu.open('end');
  }

  // Logout button calls authService logout
  logout() {
    this.authService.logout();
  }

}
