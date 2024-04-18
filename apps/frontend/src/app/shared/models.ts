export interface InvitationDto {
  id?: string;
  emailToInvite: string;
  company: CompanyDto;
}

export interface CreateInvitationDto {
  emailToInvite: string;
  companyId: string;
}

export interface CustomMeta {
  page: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginationResponseDto<T> {
  items: T[];
  meta: CustomMeta;
}

export interface CompanyDto {
  id?: string;
  VAT: string;
  name: string;
  batches?: BatchDto;
  users?: UserDto;
  invitation?: InvitationDto;
}

export enum Status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export interface BatchDto {
  lotNumber: string;
  leadContent: number;
  mercuryContent: number;
  cadmiumContent: number;
  company: CompanyDto;
  isRoHSCompliant: boolean;
  quantity: number;
  unit: Unit;
  status: Status;
  parentLotNumber?: string;
  subBatches?: BatchDto[];
}

export interface CreateBatchDto {
  lotNumber: string;
  leadContent: number;
  mercuryContent: number;
  cadmiumContent: number;
  quantity: number;
  unit: Unit;
  parentLotNumber?: string;
}

export enum Unit {
  KG = 'kg',
  TO = 'to',
  M = 'm',
}

export interface UserDto {
  email: string;
  company: CompanyDto;
}
