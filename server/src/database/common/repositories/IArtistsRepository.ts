import type { Artist } from '@prisma/client'

import type {
  DTOCreateArtist,
  DTODelete,
  DTOFullArtist,
  DTOUpdateArtist,
} from '@/database/common/dtos/songs'

export interface IArtistsRepository {
  findById(id: number): Promise<Partial<Artist> | null>
  listArtists(page: number, limit: number): Promise<DTOFullArtist[]>
  create(data: DTOCreateArtist): Promise<number>
  update(data: DTOUpdateArtist): Promise<void>
  delete(data: DTODelete): Promise<void>
}
