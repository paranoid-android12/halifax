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
            this._snackBar.open("This product is already added to the cart.", 'Undo', {duration: 1500});
            return;
          }
        }
        this.submit();
      }
    });
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
