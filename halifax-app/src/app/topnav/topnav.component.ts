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
  @Input () cartLength: number = 0;
  @Output() toggleCart = new EventEmitter<boolean>();
  @Output() toggleFilter = new EventEmitter<string>();
  userDrop = false;
  userName = '';

  constructor(
    private tokenService: TokenService,
    private routers: Router
  ){
    const decoded = this.tokenService.decodeToken() as JwtPayload;
    this.userName = decoded.data.username;
  }

  toggle(toggle: boolean){
    this.toggleCart.emit(toggle);
  }

  togFilt(string: string){
    this.toggleFilter.emit(string);
  }
  

  logout(){
    this.routers.navigate(['']);
  }
}
