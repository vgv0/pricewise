# Pricewise UAE – setup (about 20 minutes)

## 1. Get your data key
1. Create a free account at serpapi.com and copy your API key from the dashboard.

## 2. Put the code on GitHub
1. Create a free account at github.com, click New repository, name it `pricewise-uae`.
2. Click "uploading an existing file" and upload everything from this folder
   (keep the `api` and `public` folders, plus `package.json`).

## 3. Deploy on Vercel
1. Sign up at vercel.com with your GitHub account.
2. Add New > Project > import `pricewise-uae`.
3. Before clicking Deploy, open Environment Variables and add:
   - Name: `SERPAPI_KEY`
   - Value: your SerpApi key
4. Click Deploy. When it finishes, open the link and search "iPhone 16".

If the page is blank, open Project Settings > Build and Deployment and set
Output Directory to `public`, then redeploy.

## 4. Your domain
In Vercel: Settings > Domains > add the domain you bought and follow the DNS steps shown.

## Notes
- Identical searches are cached for 6 hours, which saves your free-tier quota.
- Never share or commit your SERPAPI_KEY.
