---
name: links
description: Verify that any URL/link is real before emitting it. Use whenever you are about to include a link as a source in code comments, documentation, commit messages, PR descriptions, or messages to the user, and that link did NOT come directly from a web search / fetched result or is otherwise prone to hallucination. Hallucinating links is preventable and unacceptable.
---

# Links: never hallucinate a URL

Hallucinating links is **preventable**, and therefore **absolutely unacceptable**. Any URL you state as a source must actually exist.

## When this applies

Apply this skill before emitting a URL as a source in any of:
- Code comments (e.g. `// see https://...`)
- Docs, READMEs, commit messages, PR descriptions
- Messages to the user

## Trust vs. verify

| Source of the link | Action |
|--------------------|--------|
| Came from a web search result, page or a source you actually fetched this session | Trust it, use as-is |
| You recalled it from memory / "constructed" it / pattern-guessed it | **Verify before using** |
| Any doubt at all | **Verify before using** |

## Verify with curl

Check the URL resolves with a real success status before using it:

```bash
curl -sS -o /dev/null -w "%{http_code} %{url_effective}\n" -IL "<URL>"
```

- `-I` HEAD request, `-L` follow redirects, `-sS` silent but show errors, `-w` print final status + URL.
- `200` (or another 2xx/3xx landing on real content) → safe to use.
- `404`/`403`/`000`/connection error → the link is wrong. If a HEAD is blocked, retry with `-r 0-0` or a normal GET: `curl -sSL -o /dev/null -w "%{http_code}\n" "<URL>"`.

## If verification fails

1. Do **not** emit the link.
2. Do further research (web search / official docs) to find the correct source.
3. Verify the replacement the same way.
4. If no valid source can be found, say so explicitly instead of inventing one.
