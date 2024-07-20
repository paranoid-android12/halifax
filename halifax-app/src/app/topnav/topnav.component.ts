import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() toggleCart = new EventEmitter<void>();
  userDrop = false;
  userName = '';

  constructor(
    private tokenService: TokenService,
    private routers: Router
  ){
    const decoded = this.tokenService.decodeToken() as JwtPayload;
    this.userName = decoded.data.username;
  }

  toggle(){
    this.toggleCart.emit();
  }

  home(){
    this.routers.navigate(['browse']);
  }

  logout(){
    this.routers.navigate(['']);
  }
}
