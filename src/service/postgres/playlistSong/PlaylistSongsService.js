const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../../exceptions/NotFoundError');
const InvariantError = require('../../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan ke lagu playlist');
    }

    return result.rows[0].id;
  }

  async getSongsPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id. songs.title, songs.performer FROM playlists 
        INNER JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id 
        INNER JOIN songs ON songs.id = playlist_songs.song_id WHERE playlist.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu tidak ada di Playlist');
    }

    return result.rows;
  }

  async deleteSongFromPlaylist({ playlistId, songId }) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus, id lagu tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongsService;
