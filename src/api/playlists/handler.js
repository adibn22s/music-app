class PlaylistsHandler {
  constructor(playlistsService, playlistSongsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  async postPlaylistsHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dibuat',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    // try {
    const { playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._playlistsService.deletePlaylist(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
    // } catch (error) {
    //   console.log(error);
    // }
  }

  async postSongToPlaylistHandler(request, h) {
    // try {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: owner } = request.auth.credentials;
    const action = 'add';

    await this._playlistsService.verifyPlaylistAccess(playlistId, owner);
    await this._songsService.getSongById(songId);
    await this._playlistSongsService.addSongToPlaylist({ playlistId, songId });

    await this._playlistsService.addPlaylistActivity({ playlistId, songId, owner, action });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
    // } catch (error) {
    //   console.log(error);
    // }
  }

  async getSongByPlaylistHandler(request) {
    // try {
    const { playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    playlist.allSongs = await this._playlistSongsService.getSongsPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
    // } catch (error) {
    //   console.log(error);
    // }
  }

  async deleteSongInPlaylistHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: owner } = request.auth.credentials;
    const action = 'delete';

    await this._playlistsService.verifyPlaylistAccess(playlistId, owner);
    await this._playlistSongsService.deleteSongFromPlaylist({ playlistId, songId });
    await this._playlistsService.addPlaylistActivity({ playlistId, songId, owner, action });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivityHandler(request) {
    const { playlistId: activityId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(activityId, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(activityId);
    const activity = await this._playlistsService.getPlaylistActivityById(activityId);

    return {
      status: 'success',
      data: {
        playlistId: playlist.id,
        activity,
      },
    };
  }
}

module.exports = PlaylistsHandler;
