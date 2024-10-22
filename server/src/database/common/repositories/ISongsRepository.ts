import type { Song } from '@prisma/client'

import type {
  DTOCreateSong,
  DTODelete,
  DTOFullSong,
  DTOUpdateSong,
} from '@/database/common/dtos/songs'

export interface ISongsRepository {
  findById(id: number): Promise<Partial<Song> | null>
  listSongsByAlbum(albumId: number, page: number, limit: number): Promise<DTOFullSong[]>
  create(data: DTOCreateSong): Promise<number>
  update(data: DTOUpdateSong): Promise<void>
  delete(data: DTODelete): Promise<void>
}
