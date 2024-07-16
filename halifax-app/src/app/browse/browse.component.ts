import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { Product } from '../services/product';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent {
  product: Product[] = []

  constructor(
    private dataService: DataService
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
}
