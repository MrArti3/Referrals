/**
 * Cloudflare Worker - Referrals API
 * Handles all backend operations for the Crypto Passive Income Network
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Enable CORS
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (method === 'OPTIONS') {
      return new Response('OK', { headers });
    }

    try {
      // REFERRALS ENDPOINTS
      if (path === '/api/referrals' && method === 'GET') {
        const referrals = await env.DB.prepare('SELECT * FROM referrals ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(referrals.results), { headers });
      }

      if (path === '/api/referrals' && method === 'POST') {
        const data = await request.json();
        const result = await env.DB.prepare(
          'INSERT INTO referrals (name, url, description) VALUES (?, ?, ?)'
        ).bind(data.name, data.url, data.description).run();
        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), { headers });
      }

      if (path.startsWith('/api/referrals/') && method === 'DELETE') {
        const id = path.split('/')[3];
        await env.DB.prepare('DELETE FROM referrals WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      // MEMBERS ENDPOINTS
      if (path === '/api/members' && method === 'GET') {
        const members = await env.DB.prepare('SELECT * FROM members ORDER BY earnings DESC').all();
        return new Response(JSON.stringify(members.results), { headers });
      }

      if (path === '/api/members' && method === 'POST') {
        const data = await request.json();
        const result = await env.DB.prepare(
          'INSERT INTO members (name, role, avatar, referrals, earnings) VALUES (?, ?, ?, ?, ?)'
        ).bind(data.name, data.role || 'Member', data.avatar || '⭐', data.referrals || 0, data.earnings || '$0').run();
        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), { headers });
      }

      // MESSAGES ENDPOINTS
      if (path === '/api/messages' && method === 'GET') {
        const messages = await env.DB.prepare('SELECT * FROM messages ORDER BY timestamp ASC LIMIT 50').all();
        return new Response(JSON.stringify(messages.results), { headers });
      }

      if (path === '/api/messages' && method === 'POST') {
        const data = await request.json();
        const result = await env.DB.prepare(
          'INSERT INTO messages (author, text) VALUES (?, ?)'
        ).bind(data.author, data.text).run();
        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), { headers });
      }

      // THREADS ENDPOINTS
      if (path === '/api/threads' && method === 'GET') {
        const threads = await env.DB.prepare('SELECT * FROM threads ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(threads.results), { headers });
      }

      if (path === '/api/threads' && method === 'POST') {
        const data = await request.json();
        const result = await env.DB.prepare(
          'INSERT INTO threads (title, author, content) VALUES (?, ?, ?)'
        ).bind(data.title, data.author, data.content).run();
        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), { headers });
      }

      // INVITES ENDPOINTS
      if (path === '/api/invites' && method === 'POST') {
        const data = await request.json();
        try {
          const result = await env.DB.prepare(
            'INSERT INTO invites (email) VALUES (?)'
          ).bind(data.email).run();
          return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), { headers });
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Email already invited' }), { status: 400, headers });
        }
      }

      if (path === '/api/invites' && method === 'GET') {
        const invites = await env.DB.prepare('SELECT COUNT(*) as count FROM invites').first();
        return new Response(JSON.stringify(invites), { headers });
      }

      // STATS ENDPOINT
      if (path === '/api/stats' && method === 'GET') {
        const referrals = await env.DB.prepare('SELECT COUNT(*) as count FROM referrals').first();
        const members = await env.DB.prepare('SELECT COUNT(*) as count FROM members').first();
        return new Response(JSON.stringify({
          links: referrals.count,
          members: members.count
        }), { headers });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
  },
};
