import { type Album, AlbumType, type PrismaClient } from '@prisma/client'

import type {
  DTOCreateAlbum,
  DTODelete,
  DTOFullAlbum,
  DTOUpdateAlbum,
} from '@/database/common/dtos/songs'
import type { IAlbumsRepository } from '@/database/common/repositories/IAlbumsRepository'
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/database/prisma/constants'

export class AlbumsRepository implements IAlbumsRepository {
  private db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  public async findById(id: number): Promise<Partial<Album> | null> {
    return this.db.album.findUnique({
      where: { id },
      select: {},
    })
  }

  public async listAlbumsByArtist(
    artistId: number,
    page = DEFAULT_PAGE_INDEX,
    limit = DEFAULT_PAGE_SIZE
  ): Promise<DTOFullAlbum[]> {
    const skip = (page - 1) * limit

    const albums = await this.db.album.findMany({
      skip,
      take: limit,
      where: {
        artistId,
        deletedAt: null,
      },
      orderBy: {
        releaseDate: 'asc',
      },
      select: {
        id: true,
        artistId: true,
        title: true,
        releaseDate: true,
        coverImageUrl: true,
        totalTracks: true,
        totalDuration: true,
        albumType: true,
        label: true,
      },
    })

    return albums.map(album => {
      return {
        id: album.id,
        artistId: album.artistId,
        title: album.title,
        releaseDate: album.releaseDate,
        coverImageUrl: album.coverImageUrl,
        totalTracks: album.totalTracks,
        totalDuration: album.totalDuration,
        albumType: album.albumType,
        label: album.label || undefined,
      }
    })
  }

  public async create({
    artistId,
    title,
    releaseDate,
    coverImageUrl,
    albumType,
    label,
  }: DTOCreateAlbum): Promise<number> {
    const { id } = await this.db.album.create({
      data: {
        artistId,
        title,
        releaseDate,
        albumType: <AlbumType>AlbumTypeMapProxy.get(albumType),
        coverImageUrl,
        label,
        totalDuration: 0,
        totalTracks: 0,
      },
      select: { id: true },
    })

    return id
  }

  public async update({ id, ...data }: DTOUpdateAlbum): Promise<void> {
    await this.db.album.update({
      where: { id },
      data,
      select: {},
    })
  }

  public async delete({ id, date }: DTODelete): Promise<void> {
    await this.db.album.update({
      where: { id },
      data: {
        deletedAt: date,
      },
      select: {},
    })
  }
}

const AlbumTypeMap = new Map<string, AlbumType>([
  ['STUDIO', AlbumType.STUDIO],
  ['LIVE', AlbumType.LIVE],
])

const AlbumTypeMapProxy = new Proxy(AlbumTypeMap, {
  get(map, key): AlbumType {
    const keyStr = key.toString()
    return <AlbumType>(map.has(keyStr) ? map.get(keyStr) : map.get('STUDIO'))
  },
})
