import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BatchDto, PaginationResponseDto } from '../shared/models';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BatchService {
  private readonly httpClient = inject(HttpClient);

  async getBatches(
    page = 1,
    limit = 10
  ): Promise<PaginationResponseDto<BatchDto>> {
    const batches = await firstValueFrom(
      this.httpClient.get<PaginationResponseDto<BatchDto>>(
        `/api/batches?page=${page}&limit=${limit}`
      )
    );
    return batches;
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
  sendBatch(batch: BatchDto, vatId: string): Promise<BatchDto> {
    return firstValueFrom(
      this.httpClient.patch<BatchDto>(`/api/batches/${batch.id}/send`, {
        vatId,
      })
    );
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
