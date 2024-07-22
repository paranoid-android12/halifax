import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-checkout-dialog',
  standalone: true,
  imports: [],
  templateUrl: './checkout-dialog.component.html',
  styleUrl: './checkout-dialog.component.css'
})
export class CheckoutDialogComponent {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ){

  }
}
