import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { Product } from '../services/product';
import { BrowseDialogComponent } from './browse-dialog/browse-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Cart } from '../services/cart';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TokenService } from '../services/authentication/token.service';
import { Router } from '@angular/router';
import { TopnavComponent } from "../topnav/topnav.component";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

interface JwtPayload{
  data: any
}

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, TopnavComponent, MatCheckboxModule, FormsModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent {
  product: Product[] = []
  rainyProduct: Product[] = []
  carts: Cart[] = []
  selectedLength: number = 0;
  total: number = -1;
  isCart = false;
  userDrop = false;
  userName = '';
  countdown: string = '';
  intervalId: number = -1;
  shippingFee: number = 78;
  checkAll: boolean = false;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private tokenService: TokenService,
    private routers: Router
  ){
    this.dataService.fetchData("getProduct").subscribe({
      next: (next: any) => {
        this.product = this.shuffleArray(next);
        this.rainyProduct = this.product.filter(product => product.product_category.split(',').includes('rainy'));
        this.calculateTotal();
      },
      error: (error: any) => {console.log(error)},
      complete: () => {console.log(this.product);}
    });

    const decoded = this.tokenService.decodeToken() as JwtPayload;
    this.userName = decoded.data.username;

    this.fetchCart();
    this.startCountdown()


  }

  //I hate every single moment i spent on this projects
  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

  startCountdown(): void {
    const endTime = new Date();
    endTime.setSeconds(endTime.getSeconds() + 45); // Adding seconds
    endTime.setMinutes(endTime.getMinutes() + 56); // Adding minutes
    endTime.setHours(endTime.getHours() + 12); // Adding hours
    endTime.setDate(endTime.getDate() + 2); // Adding days

    this.intervalId = window.setInterval(() => {
      const now = new Date();
      const distance = endTime.getTime() - now.getTime();

      if (distance < 0) {
        clearInterval(this.intervalId);
        this.countdown = 'EXPIRED';
        return;
      }

      // Time calculations
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.countdown = `${days} : ${hours} : ${minutes} : ${seconds}`;
    }, 1000);
  }

  calculateTotal(){
    this.total = 0;
    this.selectedLength = this.carts.filter(cart => cart.selected).length;
    this.carts.forEach(cart => {
      if(cart.selected){
        this.total = this.total + cart.product_price * cart.quantity;
      }
    })
  }

  toggleCart(event: any){
    this.isCart = event;
    this.total = 0;
  }

  updateCheckAllState(): void {
    const allChecked = this.carts.every(cart => 
      cart.selected === true
    );
    this.checkAll = allChecked;
  }

  onSelect(event: any, cart: Cart): void {
    //Turn off maincheck
    // const existAlready = this.selectedCart.some(selected => selected.product_ID === cart.product_ID);
    // console.log(existAlready);
    if(event.checked){
      console.log("Pushing selected cart...")
      for (let i = 0; i < this.carts.length; i++) {
        if(this.carts[i].cart_ID === cart.cart_ID){
          this.carts[i].selected = true;
        }
        
      }
    }
    else{
      console.log('Unchecking supposedy state:', event.checked);

      for (let i = 0; i < this.carts.length; i++) {
        if(this.carts[i].cart_ID === cart.cart_ID){
          this.carts[i].selected = false;
        }
      }
    }
    console.log(this.carts);
    this.calculateTotal();
    this.updateCheckAllState();
    // You can now use isChecked to perform further actions based on the checkbox state
  }

  selectAll(event: any): void {
    console.log(event.checked);
    if(event.checked){
      // let ele = document.getElementsByName('cartCheck');
      // ele.forEach(e => {
      //   const inputElement = e as HTMLInputElement;
      //   inputElement.checked = true;
      // });
      this.carts.forEach(cart => cart.selected = true);
      this.checkAll = true;
    }
    else{
      this.carts.forEach(cart => cart.selected = false);
    }
    console.log(this.carts);
    this.calculateTotal();
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

  logout(){
    this.routers.navigate(['']);
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
    
      
    })
  }

  incrementValue(cart: Cart){
    this.dataService.patchData({cart_ID: cart.cart_ID, quantity: cart.quantity + 1}, "addQuantity").subscribe({
      next: () => {
        this.carts.forEach(c => {
          if(c.cart_ID === cart.cart_ID){
            c.quantity = c.quantity + 1;
          }
        });
      }
    })
  }

  decrementValue(cart: Cart){
    if(cart.quantity < 1) return;
    this.dataService.patchData({cart_ID: cart.cart_ID, quantity: cart.quantity - 1}, "addQuantity").subscribe({
      next: () => {
        this.carts.forEach(c => {
          if(c.cart_ID === cart.cart_ID){
            c.quantity = c.quantity - 1;
          }
        });
      }
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
