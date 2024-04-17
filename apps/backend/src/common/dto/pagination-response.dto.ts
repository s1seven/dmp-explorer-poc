import { Expose } from 'class-transformer';

export class CustomMeta {
  @Expose()
  itemCount: number;

  @Expose()
  totalItems?: number;

  @Expose()
  itemsPerPage: number;

  @Expose()
  totalPages?: number;

  @Expose()
  currentPage: number;
}

export class PaginationResponseDto<T> {
  @Expose()
  items: T[];

  @Expose()
  meta: CustomMeta;
}
