import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { Product } from '../services/product';
import { BrowseDialogComponent } from './browse-dialog/browse-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Cart } from '../services/cart';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent {
  product: Product[] = []
  carts: Cart[] = []
  total: number = -1;
  isCart = false;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ){
    this.dataService.fetchData("getProduct").subscribe({
      next: (next: any) => {this.product = next;this.calculateTotal();},
      error: (error: any) => {console.log(error)},
      complete: () => {console.log(this.product);}
    });

    this.fetchCart();
  }

  calculateTotal(){
    this.total = 0;
    this.carts.forEach(cart => {
      this.total = this.total + cart.product_price * cart.quantity;
    })
  }

  fetchCart(){
    this.dataService.fetchData("getCart").subscribe({
      next: (next: any) => {
        console.log(next);
        this.carts = next;
        this.calculateTotal();
      }
    });
  }

  truncateName(name: string){
    if (name.length > 32) {
      return name.substring(0, 32) + '...';
    }
    return name;
  }

  openDialog(product: Product){
    this.dialog.open(BrowseDialogComponent, {
      data: {
        product: product
      }
    }).afterClosed().subscribe(() => {  
      this.fetchCart();
      this._snackBar.open("Product added to cart.", 'Undo', {duration: 1500})
      
    })
  }

  incrementValue(cart: Cart){
    this.dataService.patchData({cart_ID: cart.cart_ID, quantity: cart.quantity + 1}, "addQuantity").subscribe({
      next: () => {this.fetchCart();}
    })
  }

  decrementValue(cart: Cart){
    if(cart.quantity < 1) return;
    this.dataService.patchData({cart_ID: cart.cart_ID, quantity: cart.quantity - 1}, "addQuantity").subscribe({
      next: () => {this.fetchCart();}
    })
  }

  deleteCart(cart: Cart){
    this.dataService.deleteData("deleteCart?id=" + cart.cart_ID).subscribe({
      next: (next: any) => {
        this.fetchCart();
        this._snackBar.open("Product removed from cart.", 'Undo', {duration: 1500})
        console.log(next);
      }
    })
  }


}
