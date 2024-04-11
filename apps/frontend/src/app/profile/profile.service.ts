import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly companies = signal<any[]>([]);

  constructor(private readonly httpClient: HttpClient) {}

  async getCompanies(): Promise<any[]> {
    const companies = await firstValueFrom(
      this.httpClient.get<any>('/api/companies')
    );
    this.companies.set(companies);
    return companies;
  }
}

// BATCHES
// - getBatches
// - assignBatch
// - createBatch
// - acceptBatch

// PROFILES
// - createCompany
// - getInvitation
// - getCompany
// - createInvitation
// - acceptInvitation
// - declineInvitation
