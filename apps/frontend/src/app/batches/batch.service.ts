import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BatchDto, CreateBatchDto, PaginationResponseDto } from '../shared/models';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BatchesService {
  // TODO: persist data in service
  private readonly httpClient = inject(HttpClient);
  readonly batchesMeta = signal<PaginationResponseDto<BatchDto> | null>(null);
  readonly inboxMeta = signal<PaginationResponseDto<BatchDto> | null>(null);
  readonly batch = signal<BatchDto | null>(null);
  readonly currentSubBatch = signal<BatchDto | null>(null);
  readonly batches = computed(() => {
    if (!this.batch()) return [];
    const { lotNumber: parentLotNumber } = this.batch() || {};
    const subBatches = this.batch()?.subBatches || [];
    return [
      this.batch(),
      ...subBatches.map((batch) => ({ ...batch, parentLotNumber })),
    ] as BatchDto[];
  });
  
  async getBatches(
    page = 1,
    limit = 10
  ): Promise<PaginationResponseDto<BatchDto>> {
    const batchesMeta = await firstValueFrom(
      this.httpClient.get<PaginationResponseDto<BatchDto>>(
        `/api/batches?page=${page}&limit=${limit}`
      )
    );
    this.batchesMeta.set(batchesMeta);
    return batchesMeta;
  }

  async getInbox(
    page = 1,
    limit = 10
  ): Promise<PaginationResponseDto<BatchDto>> {
    const inboxMeta = await firstValueFrom(
      this.httpClient.get<PaginationResponseDto<BatchDto>>(
        `/api/batches/inbox?page=${page}&limit=${limit}`
      )
    );
    this.inboxMeta.set(inboxMeta);
    return inboxMeta;
  }

  async getBatch(id: string): Promise<BatchDto> {
    const batch = await firstValueFrom(
      this.httpClient.get<BatchDto>(`/api/batches/${id}`)
    );
    this.batch.set(batch);
    return batch;
  }

  // If a parentLotNumber was provided:
  // 1. Throw an error if the parent is not mine
  // Finally:
  // 2. Create the batch for my company
  createBatch(batch: CreateBatchDto): Promise<BatchDto> {
    return firstValueFrom(
      this.httpClient.post<BatchDto>('/api/batches', batch)
    );
  }

  // 1. Changes status from `accepted` to `pending`
  // 2. Changes the vat to the vat provided
  // - if the company is registered
  // - and it is not the current company
  async sendBatch(batchId: string, VAT: string): Promise<BatchDto> {
    const updatedBatch = await firstValueFrom(
      this.httpClient.patch<BatchDto>(`/api/batches/${batchId}/send`, {
        VAT,
      })
    );
    this.currentSubBatch.set(updatedBatch);
    return updatedBatch;
  }

  // Changes status from `pending` to `accepted`
  async acceptBatch(batch: BatchDto): Promise<BatchDto> {
    const acceptedBatch = await firstValueFrom(
      this.httpClient.patch<BatchDto>(
        `/api/batches/${batch.lotNumber}/accept`,
        {}
      )
    );

    // TODO: refactor this to functions
    const currentInboxMeta = this.inboxMeta();
    if (currentInboxMeta) {
      this.inboxMeta.set({
        ...currentInboxMeta,
        items: currentInboxMeta?.items.filter(
          (b) => b.lotNumber !== acceptedBatch.lotNumber
        ),
        meta: {
          ...currentInboxMeta?.meta,
          totalItems: currentInboxMeta?.meta.totalItems - 1,
          // TODO: handle case where less pages are needed
        },
      });
    }
    const currentBatchesMeta = this.batchesMeta();
    if (currentBatchesMeta) {
      this.batchesMeta.set({
        ...currentBatchesMeta,
        items: [...currentBatchesMeta.items, acceptedBatch],
        meta: {
          ...currentBatchesMeta.meta,
          totalItems: currentBatchesMeta.meta.totalItems + 1,
        },
      });
    }

    return acceptedBatch;
  }

  // 1. Changes status from `pending` to `declined`
  // 2. Changes the vat to the vat of the parent batch
  async declineBatch(batch: BatchDto): Promise<BatchDto> {
    const declinedBatch = await firstValueFrom(
      this.httpClient.patch<BatchDto>(
        `/api/batches/${batch.lotNumber}/decline`,
        {}
      )
    );

    const currentInboxMeta = this.inboxMeta();
    if (currentInboxMeta) {
      this.inboxMeta.set({
        ...currentInboxMeta,
        items: currentInboxMeta.items.filter(
          (b) => b.lotNumber !== batch.lotNumber
        ),
        meta: {
          ...currentInboxMeta.meta,
          totalItems: currentInboxMeta?.meta.totalItems - 1,
          // TODO: handle case where less pages are needed
        },
      });
    }

    return declinedBatch;
  }

  // Changes status from `declined` to `accepted`
  async reclaimBatch(batch: BatchDto): Promise<BatchDto> {
    const reclaimedBatch = await firstValueFrom(
      this.httpClient.patch<BatchDto>(
        `/api/batches/${batch.lotNumber}/reclaim`,
        {}
      )
    );

    const currentInboxMeta = this.inboxMeta();
    if (currentInboxMeta) {
      this.inboxMeta.set({
        ...currentInboxMeta,
        items: currentInboxMeta?.items.filter(
          (b) => b.lotNumber !== batch.lotNumber
        ),
        meta: {
          ...currentInboxMeta?.meta,
          totalItems: currentInboxMeta?.meta.totalItems - 1,
          // TODO: handle case where less pages are needed
        },
      });
    }
    const currentBatchesMeta = this.batchesMeta();
    if (currentBatchesMeta) {
      this.batchesMeta.set({
        ...currentBatchesMeta,
        items: [...currentBatchesMeta.items, reclaimedBatch],
        meta: {
          ...currentBatchesMeta.meta,
          totalItems: currentBatchesMeta.meta.totalItems + 1,
        },
      });
    }
    return reclaimedBatch;
  }
}
