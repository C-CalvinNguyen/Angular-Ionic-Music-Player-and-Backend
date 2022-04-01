import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.scss'],
})
export class RightMenuComponent implements OnInit {

  user: any = null;

  constructor(private menu: MenuController, private authService: AuthService) {
    this.authService.getisAuthenticated().subscribe(data => {
      this.user = data;
    });
  }

  ngOnInit() {}

  openEnd() {
    this.menu.enable(true, 'end');
    this.menu.open('end');
  }

  logout() {
    this.authService.logout();
  }

}
