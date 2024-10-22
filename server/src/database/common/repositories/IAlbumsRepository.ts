import type { Album } from '@prisma/client'

import type {
  DTOCreateAlbum,
  DTODelete,
  DTOFullAlbum,
  DTOUpdateAlbum,
} from '@/database/common/dtos/songs'

export interface IAlbumsRepository {
  findById(id: number): Promise<Partial<Album> | null>
  listAlbumsByArtist(artistId: number, page: number, limit: number): Promise<DTOFullAlbum[]>
  create(data: DTOCreateAlbum): Promise<number>
  update(data: DTOUpdateAlbum): Promise<void>
  delete(data: DTODelete): Promise<void>
}
