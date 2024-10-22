import type { PrismaClient, Song } from '@prisma/client'

import type {
  DTOCreateSong,
  DTODelete,
  DTOFullSong,
  DTOUpdateSong,
} from '@/database/common/dtos/songs'
import type { ISongsRepository } from '@/database/common/repositories/ISongsRepository'
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/database/prisma/constants'

export class SongsRepository implements ISongsRepository {
  private db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  public async findById(id: number): Promise<Partial<Song> | null> {
    return this.db.song.findUnique({
      where: { id },
      select: {},
    })
  }

  public async listSongsByAlbum(
    albumId: number,
    page = DEFAULT_PAGE_INDEX,
    limit = DEFAULT_PAGE_SIZE
  ): Promise<DTOFullSong[]> {
    const skip = (page - 1) * limit

    const songs = await this.db.song.findMany({
      skip,
      take: limit,
      where: {
        albumId,
        deletedAt: null,
      },
      orderBy: {
        trackNumber: 'asc',
      },
      select: {
        id: true,
        artistId: true,
        albumId: true,
        title: true,
        duration: true,
        fileUrl: true,
        releaseDate: true,
        genre: true,
        language: true,
        streamCount: true,
        bitrate: true,
        label: true,
        lyrics: true,
        downloadUrl: true,
        trackNumber: true,
        coverImageUrl: true,
      },
    })

    return songs.map(song => {
      return {
        id: song.id,
        artistId: song.artistId,
        albumId: song.albumId || undefined,
        title: song.title,
        duration: song.duration,
        fileUrl: song.fileUrl,
        releaseDate: song.releaseDate,
        genre: song.genre,
        language: song.language,
        streamCount: song.streamCount,
        bitrate: song.bitrate || undefined,
        label: song.label || undefined,
        lyrics: song.lyrics || undefined,
        downloadUrl: song.downloadUrl || undefined,
        trackNumber: song.trackNumber || undefined,
        coverImageUrl: song.coverImageUrl || undefined,
      }
    })
  }

  public async create({
    artistId,
    albumId,
    title,
    duration,
    fileUrl,
    releaseDate,
    genre,
    language,
    bitrate,
    label,
    lyrics,
    downloadUrl,
    trackNumber,
    coverImageUrl,
  }: DTOCreateSong): Promise<number> {
    const { id } = await this.db.song.create({
      data: {
        artistId,
        albumId,
        title,
        duration,
        fileUrl,
        releaseDate,
        genre,
        language,
        bitrate,
        label,
        lyrics,
        downloadUrl,
        trackNumber,
        coverImageUrl,
      },
      select: { id: true },
    })

    return id
  }

  public async update({ id, ...data }: DTOUpdateSong): Promise<void> {
    await this.db.song.update({
      where: { id },
      data,
      select: {},
    })
  }

  public async delete({ id, date }: DTODelete): Promise<void> {
    await this.db.song.update({
      where: { id },
      data: {
        deletedAt: date,
      },
      select: {},
    })
  }
}
