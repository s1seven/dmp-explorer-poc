import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BatchDto } from '../shared/models';
import { ProfileService } from '../profile/profile.service';
import { BatchesService } from './batch.service';
import { BatchesTableComponent } from './batches-table.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { InboxTableComponent } from './inbox-table.component';

export enum BatchInboxType {
  RECLAIM = 'RECLAIM',
  ACCEPT = 'ACCEPT',
}

export interface BatchInbox {
  type: BatchInboxType;
  batch: BatchDto;
}

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    BatchesTableComponent,
    MatPaginatorModule,
    InboxTableComponent,
  ],
  template: `
    <ng-container class="flex flex-col">
      <div
        class="flex gap-4 items-left mb-10 rounded-md p-4 border border-gray-300 flex-col max-w-full ng-untouched ng-pristine ng-invalid"
      >
        <div *ngIf="inboxMeta() as inboxMeta; loading" class="py-2">
          <h2>Inbox</h2>
          <app-inbox-table
            *ngIf="inboxBatches.length; loading"
            [batches]="inboxMeta.items"
          ></app-inbox-table>
          <p *ngIf="!inboxBatches.length">Your inbox is currently empty.</p>
          <mat-paginator
            *ngIf="inboxMeta.items.length"
            [length]="inboxMeta.meta.totalItems"
            [pageSize]="inboxMeta.meta.itemsPerPage"
            [pageIndex]="inboxMeta.meta.currentPage - 1"
            [pageSizeOptions]="[5, 10, 25, 100]"
            aria-label="Select page"
            (page)="changePage($event)"
          >
          </mat-paginator>
        </div>
      </div>

      <div
        class="flex gap-4 items-left mb-10 rounded-md p-4 border border-gray-300 flex-col max-w-full ng-untouched ng-pristine ng-invalid"
      >
        <div *ngIf="batchesMeta() as batchesMeta; loading" class="py-2">
          <h2>Batches</h2>
          <app-batches-table [batches]="batchesMeta.items"></app-batches-table>
          <mat-paginator
            [length]="batchesMeta.meta.totalItems"
            [pageSize]="batchesMeta.meta.itemsPerPage"
            [pageIndex]="batchesMeta.meta.currentPage - 1"
            [pageSizeOptions]="[5, 10, 25, 100]"
            aria-label="Select page"
            (page)="changePage($event)"
          >
          </mat-paginator>
        </div>
      </div>
      <!-- // TODO: check if angular material has skeletons -->
      <ng-template #loading>Loading...</ng-template>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchesComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly batchService = inject(BatchesService);
  readonly company = this.profileService.company();
  readonly batchesMeta = this.batchService.batchesMeta;
  readonly inboxMeta = this.batchService.inboxMeta;
  readonly inboxBatches = computed(() => this.inboxMeta()?.items);

  async changePage(event: PageEvent) {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    await this.batchService.getBatches(page, limit);
  }

  ngOnInit() {
    // TODO: use constants
    this.batchService.getBatches(1, 10);
    this.batchService.getInbox(1, 10);
  }
}
