import type {
  DTOCreateAlbum,
  DTODelete,
  DTOFullAlbum,
  DTOSimpleAlbum,
  DTOUpdateAlbum,
} from '@/database/common/dtos/songs'

export interface IAlbumsRepository {
  findById(id: number): Promise<DTOFullAlbum>
  listAlbumsByArtist(artistId: number, page?: number, limit?: number): Promise<DTOSimpleAlbum[]>
  create(data: DTOCreateAlbum): Promise<number>
  update(data: DTOUpdateAlbum): Promise<void>
  delete(data: DTODelete): Promise<void>
}
