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
import { BatchDto, Status } from '../shared/models';
import { ProfileService } from '../profile/profile.service';
import { BatchService } from './batch.service';
import { BatchesTableComponent } from './batches-table.component';

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
  imports: [CommonModule, MatTableModule, BatchesTableComponent],
  template: `
    <h2>Inbox</h2>
    <app-batches-table *ngIf="inbox().length" [batches]="inbox()"></app-batches-table>
    <p *ngIf="!inbox().length">Your inbox is currently empty.</p>
    <h2>Batches</h2>
    <app-batches-table [batches]="batches()"></app-batches-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchesComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  readonly company = computed(() => this.profileService.companies()?.[0]);
  readonly batches = signal<BatchDto[]>([]);

  // Batches that:
  // - have been sent to you but not accepted
  // - you sent to someone but they have declined
  // TODO: return BatchInbox[]
  readonly inbox = computed<BatchDto[]>(() => {
    return this.batches()
      .filter((batch) => batch.status !== Status.ACCEPTED)
      // .map((batch) => ({
      //   batch,
      //   type:
      //     batch.status === Status.PENDING
      //       ? BatchInboxType.ACCEPT
      //       : BatchInboxType.RECLAIM,
      // }));
  });

  private readonly batchService = inject(BatchService);

  async ngOnInit() {
    const batches = await this.batchService.getBatches();
    this.batches.set(batches);
  }
}
