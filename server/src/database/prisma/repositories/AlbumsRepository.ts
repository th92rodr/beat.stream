import { AlbumType, type PrismaClient } from '@prisma/client'

import { ClientError } from '@/client-error'
import type {
  DTOCreateAlbum,
  DTODelete,
  DTOFullAlbum,
  DTOSimpleAlbum,
  DTOUpdateAlbum,
} from '@/database/common/dtos/songs'
import type { IAlbumsRepository } from '@/database/common/repositories/IAlbumsRepository'
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/database/prisma/constants'

export class AlbumsRepository implements IAlbumsRepository {
  private db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  public async findById(id: number): Promise<DTOFullAlbum> {
    const album = await this.db.album.findUnique({
      where: { id },
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

    if (!album) {
      throw new ClientError('Album does not exist.')
    }

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
  }

  public async listAlbumsByArtist(
    artistId: number,
    page = DEFAULT_PAGE_INDEX,
    limit = DEFAULT_PAGE_SIZE
  ): Promise<DTOSimpleAlbum[]> {
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
      },
    })

    return albums.map(album => {
      return {
        id: album.id,
        artistId: album.artistId,
        title: album.title,
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
    })
  }

  public async delete({ id, date }: DTODelete): Promise<void> {
    await this.db.album.update({
      where: { id },
      data: {
        deletedAt: date,
      },
    })
  }
}

const AlbumTypeMap = new Map<string, AlbumType>([
  ['STUDIO', AlbumType.STUDIO],
  ['LIVE', AlbumType.LIVE],
])

const AlbumTypeMapProxy = new Proxy(AlbumTypeMap, {
  get(map, prop: string) {
    if (typeof map.get === 'function' && prop === 'get') {
      return (key: string) => {
        return map.has(key) ? map.get(key) : map.get('STUDIO')
      }
    }
    return map[prop as keyof Map<string, AlbumType>]
  },
})
