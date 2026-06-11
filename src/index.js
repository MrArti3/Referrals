export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (method === 'OPTIONS') {
      return new Response('OK', { headers });
    }

    try {
      // GET all referrals
      if (path === '/api/referrals' && method === 'GET') {
        const result = await env.DB.prepare('SELECT * FROM referrals ORDER BY id ASC').all();
        return new Response(JSON.stringify(result.results), { headers });
      }

      // GET all members
      if (path === '/api/members' && method === 'GET') {
        const result = await env.DB.prepare('SELECT * FROM members ORDER BY id ASC').all();
        return new Response(JSON.stringify(result.results), { headers });
      }

      // ADD a new member (when someone joins)
      if (path === '/api/members' && method === 'POST') {
        const data = await request.json();
        
        // Check if member already exists
        const existing = await env.DB.prepare('SELECT * FROM members WHERE name = ?').bind(data.name).first();
        if (existing) {
          return new Response(JSON.stringify({ error: 'Member already exists' }), { status: 400, headers });
        }
        
        await env.DB.prepare(
          'INSERT INTO members (name, role, avatar, referrals, earnings) VALUES (?, ?, ?, ?, ?)'
        ).bind(data.name, 'Member', '👤', 0, '$0').run();
        
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      // GET all messages
      if (path === '/api/messages' && method === 'GET') {
        const result = await env.DB.prepare('SELECT * FROM messages ORDER BY timestamp ASC LIMIT 100').all();
        return new Response(JSON.stringify(result.results), { headers });
      }

      // ADD a message
      if (path === '/api/messages' && method === 'POST') {
        const data = await request.json();
        await env.DB.prepare('INSERT INTO messages (author, text) VALUES (?, ?)').bind(data.author, data.text).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      // GET stats
      if (path === '/api/stats' && method === 'GET') {
        const referrals = await env.DB.prepare('SELECT COUNT(*) as count FROM referrals').first();
        const members = await env.DB.prepare('SELECT COUNT(*) as count FROM members').first();
        return new Response(JSON.stringify({ links: referrals.count, members: members.count }), { headers });
      }

      // TRACK a referral click (increment click count)
      if (path.startsWith('/api/track/') && method === 'GET') {
        const referralId = path.split('/')[3];
        await env.DB.prepare('UPDATE referrals SET clicks = clicks + 1 WHERE id = ?').bind(referralId).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
  },
};