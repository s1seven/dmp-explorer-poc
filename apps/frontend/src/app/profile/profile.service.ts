import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, firstValueFrom, of } from 'rxjs';
import {
  CompanyDto,
  CreateInvitationDto,
  InvitationDto,
} from '../shared/models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly companies = signal<CompanyDto[]>([]);
  readonly company = computed(() => this.companies()?.[0]);
  readonly invitations = signal<InvitationDto[]>([]);
  private readonly httpClient = inject(HttpClient);

  private companiesCache?: Promise<CompanyDto[]>;

  async getCompanies(useCache = true): Promise<CompanyDto[]> {
    if (useCache && this.companiesCache) return this.companiesCache;
    const companies = await (this.companiesCache = firstValueFrom(
      this.httpClient
        .get<CompanyDto[]>('/api/companies')
        .pipe(catchError(() => of([])))
    ));
    this.companies.set(companies);
    return companies;
  }

  createCompany(company: CompanyDto): Observable<CompanyDto> {
    return this.httpClient.post<CompanyDto>('/api/companies', company);
  }

  createInvitation(invitation: CreateInvitationDto): Observable<InvitationDto> {
    return this.httpClient.post<InvitationDto>('/api/invitations', invitation);
  }

  getInvitations(): Observable<InvitationDto[]> {
    return this.httpClient.get<InvitationDto[]>('/api/invitations');
  }

  respondToInvitation(invitation: InvitationDto, accepted: boolean) {
    return this.httpClient.post<void>(`/api/invitations/${invitation.id}`, {
      accepted,
    });
  }
}

// PROFILES
// - createCompany
// - getInvitation
// - getCompany
// - createInvitation
// - acceptInvitation
// - declineInvitation
