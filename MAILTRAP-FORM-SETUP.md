# BridgeWords contact form / Mailtrap deployment

The public website may remain on GitHub Pages, but GitHub Pages cannot securely execute the Mailtrap API because it has no server-side runtime.

## Mail settings
- Mailtrap token environment variable: `MAILTRAP`
- Authorized sender email: `amit@axon.com.sg`
- Sender name: `BridgeWords Consulting Pte Ltd`
- Admin recipient: `nweijoo@gmail.com`
- Customer acknowledgement: submitted visitor email
- Customer reply-to: `nweijoo@gmail.com`
- Admin message reply-to: submitted visitor email

## Secure deployment
Deploy this repository (or just the `api/contact.js` function) to Vercel and add `MAILTRAP` as an encrypted environment variable.

The GitHub "Agents secrets and variables" value is not exposed to GitHub Pages at runtime. The Mailtrap token must never be placed in `assets/site.js` or any public HTML.

If the frontend remains at GitHub Pages while the API is deployed elsewhere, add before `assets/site.js`:

```html
<script>window.BRIDGEWORDS_CONTACT_API='https://YOUR-SERVERLESS-DOMAIN/api/contact';</script>
```

If the whole site is served from Vercel, no frontend endpoint override is required because the form uses `/api/contact`.
