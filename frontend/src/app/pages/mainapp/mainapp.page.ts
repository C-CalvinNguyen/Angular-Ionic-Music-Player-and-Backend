import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-mainapp',
  templateUrl: './mainapp.page.html',
  styleUrls: ['./mainapp.page.scss'],
})
export class MainappPage implements OnInit {

  user: any = {};

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
    console.log(this.user);
  }

  ngOnInit() {
  }

}
