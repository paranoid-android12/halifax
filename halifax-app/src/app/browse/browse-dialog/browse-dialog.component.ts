import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../services/product';
import { DataService } from '../../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-browse-dialog',
  standalone: true,
  imports: [],
  templateUrl: './browse-dialog.component.html',
  styleUrl: './browse-dialog.component.css'
})
export class BrowseDialogComponent {
  product!: Product;
  count: number = 0

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private dialogRef: MatDialogRef<BrowseDialogComponent>,
    private _snackBar: MatSnackBar
  ){
    this.product = data.product;
  }

  subt(){
    if(this.count == 0) return;
    this.count--;
  }

  checkExist(){
    this.dataService.fetchData("getCart").subscribe({
      next: (next: any) => {
        console.log(next);
        for(let x of next){
          if(x.product_ID === this.product.product_ID){
            this.increment(x.cart_ID, x.quantity, this.count);
            return;
          }
        }
        this.submit();
      }
    });
  }

  increment(cartID: number, cartCount: number, toAddCount: number){
    const newCount = +cartCount + +toAddCount;
    console.log(newCount, cartCount, toAddCount);
    this.dataService.postData({id: cartID, count: newCount}, "incrementCart").subscribe({
      next: (next:any) => {
        this._snackBar.open("Product already exists and is appended to the cart.", 'Undo', {duration: 1500});
        this.dialogRef.close();
      }
    })
  }

  submit(){
    this.dataService.postData({product: this.product, count: this.count}, "addCart").subscribe({
      next: (next:any) => {
        this._snackBar.open("Product added to cart.", 'Undo', {duration: 1500})
        this.dialogRef.close();
      }
    })
  }

}
