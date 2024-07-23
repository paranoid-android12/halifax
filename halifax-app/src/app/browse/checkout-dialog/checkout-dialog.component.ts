import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TokenService } from '../../services/authentication/token.service';

interface JwtPayload{
  data: any
}

@Component({
  selector: 'app-checkout-dialog',
  standalone: true,
  imports: [],
  templateUrl: './checkout-dialog.component.html',
  styleUrl: './checkout-dialog.component.css'
})
export class CheckoutDialogComponent {
  user: any = '';
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tokenService: TokenService,
  ){
    const decoded = this.tokenService.decodeToken() as JwtPayload;
    this.user = decoded.data;
  }
}
