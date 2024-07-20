import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/authentication/token.service';

interface JwtPayload{
  data: any
}

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.css'
})
export class TopnavComponent {
  userDrop = false;
  userName = '';

  constructor(
    private tokenService: TokenService,
    private routers: Router
  ){
    const decoded = this.tokenService.decodeToken() as JwtPayload;
    this.userName = decoded.data.username;
  }

  logout(){
    this.routers.navigate(['']);
  }
}
