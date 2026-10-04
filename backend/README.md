# Optional site-wide trending backend

SignMyWord works without a backend. In that mode, trending counts stay on the visitor's device.

For shared anonymous 7-day trends, deploy `cloudflare-worker.js` as a Cloudflare Worker and add a KV binding named `SIGNMYWORD_TRENDS`.

Then set the deployed Worker URL before `app.js` loads:

```html
<script>
  window.SIGNMYWORD_POPULAR_API = "https://your-worker.example.workers.dev";
</script>
```

The Worker stores only aggregate word/phrase + language counts by UTC day. It does not intentionally store names, accounts or IP addresses in the trend data. Public results require at least 3 searches before a term appears.

For higher traffic, replace KV increment logic with a transactional store such as Durable Objects or a database to avoid concurrent-write count loss.
