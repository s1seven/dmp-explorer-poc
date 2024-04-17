import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BatchDto, PaginationResponseDto, Status } from '../shared/models';
import { ProfileService } from '../profile/profile.service';
import { BatchService } from './batch.service';
import { BatchesTableComponent } from './batches-table.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

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
  ],
  template: `
    <h2>Inbox</h2>
    <app-batches-table
      *ngIf="inbox().length"
      [batches]="inbox()"
    ></app-batches-table>
    <p *ngIf="!inbox().length">Your inbox is currently empty.</p>
    <h2>Batches</h2>
    <app-batches-table [batches]="batchesMeta().items"></app-batches-table>
    <mat-paginator
      [length]="batchesMeta().meta.totalItems"
      [pageSize]="batchesMeta().meta.itemsPerPage"
      [pageIndex]="batchesMeta().meta.currentPage - 1"
      [pageSizeOptions]="[5, 10, 25, 100]"
      aria-label="Select page"
      (page)="onPageChange($event)"
    >
    </mat-paginator>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchesComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  readonly company = computed(() => this.profileService.companies()?.[0]);
  readonly batchesMeta = signal<PaginationResponseDto<BatchDto>>({
    items: [],
    meta: {
      page: 1,
      totalItems: 0,
      itemsPerPage: 10,
      currentPage: 1,
      totalPages: 0,
    },
  });

  // Batches that:
  // - have been sent to you but not accepted
  // - you sent to someone but they have declined
  // TODO: return BatchInbox[]
  readonly inbox = computed<BatchDto[]>(() => {
    return this.batchesMeta().items.filter(
      (batch) => batch.status !== Status.ACCEPTED
    );
    // .map((batch) => ({
    //   batch,
    //   type:
    //     batch.status === Status.PENDING
    //       ? BatchInboxType.ACCEPT
    //       : BatchInboxType.RECLAIM,
    // }));
  });

  private readonly batchService = inject(BatchService);

  async onPageChange(event: PageEvent) {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    const batches = await this.batchService.getBatches(page, limit);
    this.batchesMeta.set(batches);
  }

  async ngOnInit() {
    const page = this.batchesMeta().meta.currentPage;
    const limit = this.batchesMeta().meta.itemsPerPage;
    const batches = await this.batchService.getBatches(page, limit);
    this.batchesMeta.set(batches);
  }
}
