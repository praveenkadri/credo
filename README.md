# Credo Operations Workspace

Run:

npm install
npm run dev

## Source archive

Use `npm run zip` to create `project-source.zip`. The script packages files reported by `git ls-files --cached --others --exclude-standard`, so ignored files such as `.env.local`, `.next/`, and `node_modules/` are not included.

## Supabase Auth Redirect URLs

Supabase email auth must allow the callback route used by Credo:

- Local development: `http://localhost:<port>/auth/callback`
- Production: `https://<production-domain>/auth/callback`

Add the real production domain in the Supabase dashboard once it is known.
