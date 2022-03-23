-- CREATE TABLES

CREATE TABLE IF NOT EXISTS song(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  artist TEXT,
  album TEXT,
  genre TEXT,
  source TEXT,
  sourceType TEXT CHECK( sourceType IN ('online', 'offline')),
  onlineId TEXT
);

CREATE TABLE IF NOT EXISTS list(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT
);

CREATE TABLE IF NOT EXISTS song_list(
  s_l_id INTEGER PRIMARY KEY AUTOINCREMENT,
  s_id INTEGER,
  l_id INTEGER,
  FOREIGN KEY (s_id) REFERENCES song(id),
  FOREIGN KEY (l_id) REFERENCES list(id)
);

-- INSERT DUMMY DATA

-- Dummy Song
INSERT OR IGNORE INTO song (
  id,
  title,
  artist,
  album,
  genre,
  source,
  sourceType,
  onlineId
) VALUES (
  1,
  'Dummy Song',
  'Dummy Artist',
  'Dummy Album',
  'Dummy Genre',
  'Dummy Source',
  'offline',
  ''
);

-- Dummy Playlist
INSERT OR IGNORE INTO list (
  id,
  title
) VALUES (
  1,
  'Dummy Playlist'
);

INSERT OR IGNORE INTO song_list (
  s_l_id,
  s_id,
  l_id
) VALUES (
  1,
  1,
  1
)
