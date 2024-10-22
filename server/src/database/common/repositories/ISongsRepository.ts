import type {
  DTOCreateSong,
  DTODelete,
  DTOFullSong,
  DTOSimpleSong,
  DTOUpdateSong,
} from '@/database/common/dtos/songs'

export interface ISongsRepository {
  findById(id: number): Promise<DTOFullSong>
  listSongsByAlbum(albumId: number, page?: number, limit?: number): Promise<DTOSimpleSong[]>
  create(data: DTOCreateSong): Promise<number>
  update(data: DTOUpdateSong): Promise<void>
  delete(data: DTODelete): Promise<void>
}
