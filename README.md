# IntensitySuccess
Consulting site that hosts different topics with blog, podcasts, videos, and solution services 

Quick start (GitHub Pages)
1) Create a new repo on GitHub (public). Example name: `intensitysuccess`.
2) Add these files to the repo root: `index.html`, `styles.css`, `script.js`, `404.html`, and `CNAME`.
3) Commit → Settings → Pages → **Source: `Deploy from a branch`** → **Branch: `main` / folder: `/root`** → Save.
4) Your site will build. It will be live at `https://<username>.github.io/<repo>/` until you attach your domain.
5) **Custom domain**: Add a `CNAME` file with `intensitysuccess.com`. In your DNS:
   - `A` record → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages IPv4)
   - (Optional) `AAAA` records → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - (Optional) `CNAME` for `www` → `<jon738>.github.io.`
   Then enable the domain under **Settings → Pages → Custom domain**, and turn on **Enforce HTTPS** after the certificate is ready.

