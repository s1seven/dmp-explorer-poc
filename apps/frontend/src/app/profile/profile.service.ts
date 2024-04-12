import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { CompanyDto, InvitationDto } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly companies = signal<CompanyDto[]>([]);
  private readonly httpClient = inject(HttpClient);

  async getCompanies(): Promise<CompanyDto[]> {
    const companies = await firstValueFrom(
      this.httpClient.get<CompanyDto[]>('/api/companies')
    );
    this.companies.set(companies);
    return companies;
  }

  getInvitations(): Observable<InvitationDto[]> {
    return this.httpClient.get<InvitationDto[]>('/api/invitations');
  }
}

// PROFILES
// - createCompany
// - getInvitation
// - getCompany
// - createInvitation
// - acceptInvitation
// - declineInvitation
