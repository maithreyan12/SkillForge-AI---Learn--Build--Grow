/**
 * db.js – Lightweight JSON file-based store (no native compilation needed)
 * Works with any Node.js version.
 *
 * Schema:
 *   data/db.json → { contacts: [...], subscribers: [...] }
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, 'data', 'db.json');

// Ensure the data directory and file exist
function ensureFile() {
  if (process.env.VERCEL) {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ contacts: [], subscribers: [] }, null, 2));
    }
    return;
  }
  const dir = path.join(__dirname, 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ contacts: [], subscribers: [] }, null, 2));
  }
}

function read() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function write(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Insert a contact message.
 * Returns the inserted record.
 */
function insertContact({ name, email, message }) {
  const db   = read();
  const id   = db.contacts.length + 1;
  const record = { id, name, email, message, created_at: new Date().toISOString() };
  db.contacts.push(record);
  write(db);
  return record;
}

/**
 * Insert a newsletter subscriber.
 * Returns { inserted: true } or { inserted: false } (duplicate).
 */
function insertSubscriber(email) {
  const db = read();
  const exists = db.subscribers.some(s => s.email === email);
  if (exists) return { inserted: false };
  const id = db.subscribers.length + 1;
  db.subscribers.push({ id, email, created_at: new Date().toISOString() });
  write(db);
  return { inserted: true };
}

/**
 * Return counts for stats endpoint.
 */
function getStats() {
  const db = read();
  return {
    total_messages:    db.contacts.length,
    total_subscribers: db.subscribers.length,
  };
}

module.exports = { insertContact, insertSubscriber, getStats };
