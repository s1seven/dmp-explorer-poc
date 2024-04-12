import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BatchDto } from '../shared/models';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BatchService {
  readonly batches = signal<BatchDto[]>([]);
  private readonly httpClient = inject(HttpClient);

  createBatch(batch: BatchDto): Promise<BatchDto> {
    return firstValueFrom(
      this.httpClient.post<BatchDto>('/api/batches', batch)
    );
  }

  async getBatches(): Promise<BatchDto[]> {
    const batches = await firstValueFrom(
      this.httpClient.get<BatchDto[]>('/api/batches')
    );
    this.batches.set(batches);
    return batches;
  }

  sendBatch(batch: BatchDto, vatId: string): Promise<BatchDto> {
    return firstValueFrom(
      this.httpClient.post<BatchDto>('/api/batches/send', { batch, vatId })
    );
  }

  acceptBatch(batch: BatchDto): Promise<BatchDto> {
    return firstValueFrom(
      this.httpClient.post<BatchDto>('/api/batches/accept', batch)
    );
  }

  declineBatch(batch: BatchDto): Promise<BatchDto> {
    return firstValueFrom(
      this.httpClient.post<BatchDto>('/api/batches/decline', batch)
    );
  }

  reclaimBatch(batch: BatchDto): Promise<BatchDto> {
    return firstValueFrom(
      this.httpClient.post<BatchDto>('/api/batches/reclaim', batch)
    );
  }
}
