import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { KohaService, KohaItem } from '../../core/koha/koha.service';

@Component({
  selector: 'ds-koha-items',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-4">
      <div class="d-flex flex-row border-bottom mb-4 pb-4"></div>
      <h2>Recent Koha Items</h2>
      <div *ngIf="kohaItems$ | async as items; else loading">
        <ul class="list-unstyled m-0 p-0" *ngIf="items.length > 0; else noItems">
          <li class="my-4" *ngFor="let item of items">
            <div class="pb-4">
              <h5><a [href]="item.url" target="_blank">{{ item.title }}</a></h5>
              <p class="text-muted mb-1" *ngIf="item.author">{{ item.author }}</p>
              <p class="text-muted mb-1" *ngIf="item.publisher">{{ item.publisher }}<span *ngIf="item.year">, {{ item.year }}</span></p>
            </div>
          </li>
        </ul>
        <ng-template #noItems>
          <p class="text-muted">No Koha items available.</p>
        </ng-template>
      </div>
      <ng-template #loading>
        <p class="text-muted">Loading Koha items...</p>
      </ng-template>
    </div>
  `,
  styles: [`
    a {
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class KohaItemsComponent implements OnInit {
  kohaItems$: Observable<KohaItem[]>;

  constructor(private kohaService: KohaService) {}

  ngOnInit(): void {
    console.log('KohaItemsComponent: Initializing...');
    this.kohaItems$ = this.kohaService.getRecentKohaItems(6);
    this.kohaItems$.subscribe({
      next: (items) => console.log('KohaItemsComponent: Received items:', items),
      error: (error) => console.error('KohaItemsComponent: Error:', error)
    });
  }
}