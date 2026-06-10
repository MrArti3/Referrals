CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'Member',
  avatar TEXT,
  referrals INTEGER DEFAULT 0,
  earnings TEXT DEFAULT '$0',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS threads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  replies INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert your referral links
INSERT INTO referrals (name, url, description) VALUES
('BetFury', 'https://betfury.io/', 'Crypto gaming with daily earnings'),
('Final Autoclaim', 'https://www.finalauto.info/', 'Auto-claiming rewards platform'),
('Chainers.io', 'https://chainers.io/', 'Earn crypto from tasks and activities'),
('Rollercoin', 'https://rollercoin.com/', 'Mining simulator game with real rewards'),
('Cointiply', 'https://cointiply.com/', 'Earn cryptocurrency completing tasks'),
('Freecash', 'https://freecash.com/', 'Get paid for surveys and tasks'),
('Fire Faucet', 'https://firefaucet.com/', 'High-paying crypto faucet'),
('SimpleBits', 'https://simplebits.io/', 'Earn BTC from various activities'),
('Vie Faucet', 'https://viefaucet.com/', 'Automated faucet earnings'),
('Honeygain', 'https://www.honeygain.com/', 'Passive income from your internet'),
('Uprock', 'https://uprock.com/', 'Earn from your idle bandwidth'),
('TraffMonetizer', 'https://traffmonetizer.com/', 'Monetize your internet traffic');

-- Insert you as the network owner
INSERT INTO members (name, role, avatar, referrals, earnings) VALUES
('You', 'Network Owner', '👑', 0, '$0');