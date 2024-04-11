import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly http = inject(HttpClient);
  constructor() {}

  async getCompanies(): Promise<any[]> {
    const companies = await firstValueFrom(this.http.get<any>('/api/companies'));  
    console.log(companies);
    return companies;
  }
}
