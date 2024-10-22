/* * * * * * * * * *
 *
 * Artist DTOs
 *
 * * * * * * * * * */

export interface DTOSimpleArtist {
  id: number
  name: string
}

export interface DTOFullArtist {
  id: number
  name: string
  genre: string
  profilePictureUrl: string
  artistType: string
  bio?: string
  countryOfOrigin?: string
  formedIn?: Date
}

export interface DTOCreateArtist {
  name: string
  genre: string
  profilePictureUrl: string
  artistType: string
  bio?: string
  countryOfOrigin?: string
  formedIn?: Date
}

export interface DTOUpdateArtist {
  id: number
  name?: string
  genre?: string
  profilePictureUrl?: string
  bio?: string
  countryOfOrigin?: string
  formedIn?: Date
}

/* * * * * * * * * *
 *
 * Album DTOs
 *
 * * * * * * * * * */

export interface DTOSimpleAlbum {
  id: number
  artistId: number
  title: string
}

export interface DTOFullAlbum {
  id: number
  artistId: number
  title: string
  releaseDate: Date
  coverImageUrl: string
  totalTracks: number
  totalDuration: number
  albumType: string
  label?: string
}

export interface DTOCreateAlbum {
  artistId: number
  title: string
  releaseDate: Date
  coverImageUrl: string
  albumType: string
  label?: string
}

export interface DTOUpdateAlbum {
  id: number
  title?: string
  releaseDate?: Date
  coverImageUrl?: string
  label?: string
}

/* * * * * * * * * *
 *
 * Song DTOs
 *
 * * * * * * * * * */

export interface DTOSimpleSong {
  id: number
  artistId: number
  albumId: number
  title: string
}

export interface DTOFullSong {
  id: number
  artistId: number
  albumId?: number
  title: string
  duration: number
  fileUrl: string
  releaseDate: Date
  genre: string
  language: string
  streamCount: number
  bitrate?: number
  label?: string
  lyrics?: string
  downloadUrl?: string
  trackNumber?: number
  coverImageUrl?: string
}

export interface DTOCreateSong {
  artistId: number
  albumId: number
  title: string
  duration: number
  fileUrl: string
  releaseDate: Date
  genre: string
  language: string
  bitrate?: number
  label?: string
  lyrics?: string
  downloadUrl?: string
  trackNumber?: number
  coverImageUrl?: string
}

export interface DTOUpdateSong {
  id: number
  title?: string
  duration?: number
  fileUrl?: string
  releaseDate?: Date
  genre?: string
  language?: string
  bitrate?: number
  label?: string
  lyrics?: string
  downloadUrl?: string
  trackNumber?: number
  coverImageUrl?: string
}

/* * * * * * * * * *
 *
 * Common DTOs
 *
 * * * * * * * * * */

export interface DTODelete {
  id: number
  date: Date
}
