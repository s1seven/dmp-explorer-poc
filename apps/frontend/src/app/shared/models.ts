export interface InvitationDto {
  emailToInvite: string;
  company: CompanyDto;
}

export interface CompanyDto {
  id: string;
  VAT: string;
  name: string;
  batches?: BatchDto;
  users?: UserDto;
  invitation?: InvitationDto;
}

export interface BatchDto {
  id: string;
  lotNumber: string;
  leadContent: number;
  mercuryContent: number;
  cadmiumContent: number;
  company: CompanyDto;
  isRoHSCompliant: boolean;
  quantity: number;
  unit: Unit;
  parentLotNumber?: string;
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
