import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../services/product';
import { DataService } from '../../services/data.service';

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
  ){
    this.product = data.product;
  }

  subt(){
    if(this.count == 0) return;
    this.count--;
  }

  submit(){
    this.dataService.postData({product: this.product, count: this.count}, "addCart").subscribe({
      next: (next:any) => console.log(next)
    })
  }

}
