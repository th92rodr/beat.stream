import { type Artist, ArtistType, type PrismaClient } from '@prisma/client'

import type {
  DTOCreateArtist,
  DTODelete,
  DTOFullArtist,
  DTOUpdateArtist,
} from '@/database/common/dtos/songs'
import type { IArtistsRepository } from '@/database/common/repositories/IArtistsRepository'
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/database/prisma/constants'

export class ArtistsRepository implements IArtistsRepository {
  private db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  public async findById(id: number): Promise<Partial<Artist> | null> {
    return this.db.artist.findUnique({
      where: { id },
      select: {},
    })
  }

  public async listArtists(
    page = DEFAULT_PAGE_INDEX,
    limit = DEFAULT_PAGE_SIZE
  ): Promise<DTOFullArtist[]> {
    const skip = (page - 1) * limit

    const artists = await this.db.artist.findMany({
      skip,
      take: limit,
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        genre: true,
        profilePictureUrl: true,
        artistType: true,
        bio: true,
        countryOfOrigin: true,
        formedIn: true,
      },
    })

    return artists.map(artist => {
      return {
        id: artist.id,
        name: artist.name,
        genre: artist.genre,
        profilePictureUrl: artist.profilePictureUrl,
        artistType: artist.artistType,
        bio: artist.bio || undefined,
        countryOfOrigin: artist.countryOfOrigin || undefined,
        formedIn: artist.formedIn || undefined,
      }
    })
  }

  public async create({
    name,
    genre,
    artistType,
    profilePictureUrl,
    bio,
    countryOfOrigin,
    formedIn,
  }: DTOCreateArtist): Promise<number> {
    const { id } = await this.db.artist.create({
      data: {
        name,
        genre,
        artistType: <ArtistType>ArtistTypeMapProxy.get(artistType),
        profilePictureUrl,
        bio,
        countryOfOrigin,
        formedIn,
      },
      select: { id: true },
    })

    return id
  }

  public async update({ id, ...data }: DTOUpdateArtist): Promise<void> {
    await this.db.artist.update({
      where: { id },
      data,
      select: {},
    })
  }

  public async delete({ id, date }: DTODelete): Promise<void> {
    await this.db.artist.update({
      where: { id },
      data: {
        deletedAt: date,
      },
      select: {},
    })
  }
}

const ArtistTypeMap = new Map<string, ArtistType>([
  ['BAND', ArtistType.BAND],
  ['SOLO', ArtistType.SOLO],
])

const ArtistTypeMapProxy = new Proxy(ArtistTypeMap, {
  get(map, key): ArtistType {
    const keyStr = key.toString()
    return <ArtistType>(map.has(keyStr) ? map.get(keyStr) : map.get('BAND'))
  },
})
