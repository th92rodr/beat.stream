import type {
  DTOCreateArtist,
  DTODelete,
  DTOFullArtist,
  DTOSimpleArtist,
  DTOUpdateArtist,
} from '@/database/common/dtos/songs'

export interface IArtistsRepository {
  findById(id: number): Promise<DTOFullArtist>
  listArtists(page?: number, limit?: number): Promise<DTOSimpleArtist[]>
  create(data: DTOCreateArtist): Promise<number>
  update(data: DTOUpdateArtist): Promise<void>
  delete(data: DTODelete): Promise<void>
}
