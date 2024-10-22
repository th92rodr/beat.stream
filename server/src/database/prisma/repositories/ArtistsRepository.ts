import { ArtistType, type PrismaClient } from '@prisma/client'

import { ClientError } from '@/client-error'
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/database/common/constants'
import type {
  DTOCreateArtist,
  DTODelete,
  DTOFullArtist,
  DTOSimpleArtist,
  DTOUpdateArtist,
} from '@/database/common/dtos/songs'
import type { IArtistsRepository } from '@/database/common/repositories/IArtistsRepository'

export class ArtistsRepository implements IArtistsRepository {
  private db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  public async findById(id: number): Promise<DTOFullArtist> {
    const artist = await this.db.artist.findUnique({
      where: { id },
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

    if (!artist) {
      throw new ClientError('Artist does not exist.')
    }

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
  }

  public async listArtists(
    page = DEFAULT_PAGE_INDEX,
    limit = DEFAULT_PAGE_SIZE
  ): Promise<DTOSimpleArtist[]> {
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
      },
    })

    return artists.map(artist => {
      return {
        id: artist.id,
        name: artist.name,
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
    })
  }

  public async delete({ id, date }: DTODelete): Promise<void> {
    await this.db.artist.update({
      where: { id },
      data: {
        deletedAt: date,
      },
    })
  }
}

const ArtistTypeMap = new Map<string, ArtistType>([
  ['BAND', ArtistType.BAND],
  ['SOLO', ArtistType.SOLO],
])

const ArtistTypeMapProxy = new Proxy(ArtistTypeMap, {
  get(map, prop: string) {
    if (typeof map.get === 'function' && prop === 'get') {
      return (key: string) => {
        return map.has(key) ? map.get(key) : map.get('BAND')
      }
    }
    return map[prop as keyof Map<string, ArtistType>]
  },
})
