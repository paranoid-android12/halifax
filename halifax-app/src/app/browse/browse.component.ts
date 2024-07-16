import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent {
  constructor(
    private dataService: DataService
  ){
    this.dataService.fetchData("getProduct").subscribe({
      next: (next: any) => {console.log()},
      error: (error: any) => {console.log(error)},
      complete: () => {}
    })
  }
}
