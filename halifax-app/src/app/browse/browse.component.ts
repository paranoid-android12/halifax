import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { Product } from '../services/product';
import { BrowseDialogComponent } from './browse-dialog/browse-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent {
  product: Product[] = []
  isCart = true;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog
  ){
    this.dataService.fetchData("getProduct").subscribe({
      next: (next: any) => {this.product = next;},
      error: (error: any) => {console.log(error)},
      complete: () => {console.log(this.product);}
    })
  }

  truncateName(name: string){
    if (name.length > 35) {
      return name.substring(0, 35) + '...';
    }
    return name;
  }

  openDialog(product: Product){
    this.dialog.open(BrowseDialogComponent, {
      data: {
        product: product
      }
    })
  }


}
