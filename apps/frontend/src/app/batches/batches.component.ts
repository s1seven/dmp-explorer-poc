import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BatchDto, Status } from '../shared/models';
import { ProfileService } from '../profile/profile.service';
import { BatchesService } from './batch.service';
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
    <ng-container *ngIf="batchesMeta() as batchesMeta; loading">
      <h2>Batches</h2>
      <!-- TODO: display subbatches as a new route -->
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
    </ng-container>
    <!-- // TODO: check if angular material has skeletons -->
    <ng-template #loading>Loading...</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchesComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly batchService = inject(BatchesService);
  readonly company = this.profileService.company();
  readonly batchesMeta = this.batchService.batchesMeta;

  // Batches that:
  // - have been sent to you but not accepted
  // - you sent to someone but they have declined
  // TODO: return BatchInbox[]
  readonly inbox = computed<BatchDto[]>(() => {
    return (
      this.batchesMeta()?.items.filter(
        (batch) => batch.status !== Status.ACCEPTED
      ) || []
    );
    // .map((batch) => ({
    //   batch,
    //   type:
    //     batch.status === Status.PENDING
    //       ? BatchInboxType.ACCEPT
    //       : BatchInboxType.RECLAIM,
    // }));
  });

  async changePage(event: PageEvent) {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    await this.batchService.getBatches(page, limit);
  }

  ngOnInit() {
    // TODO: use constants
    this.batchService.getBatches(1, 10);
  }
}
