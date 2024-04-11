export interface InvitationDto {
  emailToInvite: string;
  company: CompanyDto;
}

export interface CompanyDto {
  VAT: string;
  name: string;
  batches?: BatchDto;
  users?: UserDto;
  invitation?: InvitationDto;
}

export interface BatchDto {
  lotNumber: string;
  parentLotNumber: string;
  leadContent: number;
  mercuryContent: number;
  cadmiumContent: number;
  company: CompanyDto;
  isRoHSCompliant: boolean;
  quantity: number;
  unit: Unit;
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
