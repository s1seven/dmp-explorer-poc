import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BatchDto, PaginationResponseDto } from '../shared/models';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BatchesService {
  // TODO: persist data in service
  private readonly httpClient = inject(HttpClient);
  readonly batchesMeta = signal<PaginationResponseDto<BatchDto> | null>(null);
  readonly batch = signal<BatchDto | null>(null);
  readonly currentSubBatch = signal<BatchDto | null>(null);

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
  createBatch(batch: BatchDto): Promise<BatchDto> {
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
  acceptBatch(batch: BatchDto): Promise<BatchDto> {
    return firstValueFrom(
      this.httpClient.patch<BatchDto>(`/api/batches/${batch.id}/accept`, {})
    );
  }

  // 1. Changes status from `pending` to `declined`
  // 2. Changes the vat to the vat of the parent batch
  declineBatch(batch: BatchDto): Promise<BatchDto> {
    return firstValueFrom(
      this.httpClient.patch<BatchDto>(`/api/batches/${batch.id}/decline`, {})
    );
  }

  // Changes status from `declined` to `accepted`
  reclaimBatch(batch: BatchDto): Promise<BatchDto> {
    return firstValueFrom(
      this.httpClient.get<BatchDto>(`/api/batches/${batch.id}/reclaim`)
    );
  }
}
