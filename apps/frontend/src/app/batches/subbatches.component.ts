import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BatchesService } from './batch.service';
import { Subject, map, takeUntil } from 'rxjs';
import { BatchDto } from '../shared/models';
import { SubBatchesTableComponent } from './subbatches-table.component';

@Component({
  selector: 'app-subbatches',
  standalone: true,
  imports: [CommonModule, SubBatchesTableComponent],
  template: ` <ng-container *ngIf="this.batches(); loading">
    <app-subbatches-table [batches]="this.batches()"></app-subbatches-table>
  </ng-container>`,
  styles: ``,
})
export class SubbatchesComponent implements OnInit, OnDestroy {
  private readonly batchService = inject(BatchesService);
  private destroy$ = new Subject<void>();
  readonly batch = this.batchService.batch;
  readonly batches = this.batchService.batches;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((params: ParamMap) => {
          const id = params.get('batchId');
          if (id) this.batchService.getBatch(id);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
