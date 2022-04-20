import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-mainapp',
  templateUrl: './mainapp.page.html',
  styleUrls: ['./mainapp.page.scss'],
})
export class MainappPage implements OnInit {

  // Variables used
  user: any = {};

  // Gets user from authService
  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
  }

}
