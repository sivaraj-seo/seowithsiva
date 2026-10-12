---
title: "How Long Does Google Take to Index, Update, and Recover?"
metaTitle: "How Long Does Google Take to Index, Update, and Recover?"
excerpt: "How long Google Search changes take, all 23 timings from Gary Illyes at Search Central Live, plus why the stages compound and a title edit waits a month."
date: "2026-10-12"
category: "Technical SEO"
readTime: "10 min read"
image: "/images/how-long-google-search-changes-take.webp"
featured: false
keyTakeaways:
  - "Discovery of a new URL typically takes about 20 hours. Refreshing a URL Google already knows typically takes about 30 days, which is the figure that governs most edits to existing pages."
  - "End-to-end indexing typically takes about 1.5 hours once a page is crawled, so indexing is rarely the bottleneck. Getting recrawled is."
  - "Five processes list \"never\" as the slowest case, and ROAST reports that \"never\" usually ties to quality."
  - "Core update recovery typically takes 3 to 6 months, and at worst runs 6 months to a year because it waits for the next core update."
  - "ROAST states each process had a fastest, typical, and slowest figure. Every published table, including this one, shows only two of the three."
faqs:
  - question: "How long does it take Google to index a page?"
    answer: "Discovery of a new URL typically takes about 20 hours and end-to-end indexing about 1.5 hours, so roughly a day in the typical case. The slowest case is weeks, or never for quality reasons."
  - question: "How long before a title change shows in Google?"
    answer: "The title update itself typically takes 1 to 2 days after Google reprocesses the page. Since refreshing a known URL typically takes about 30 days, the realistic wait from your edit is closer to a month."
  - question: "How often does Google recrawl an existing page?"
    answer: "Refreshing a known URL typically takes about 30 days, with a worst-case of weeks to never. Discovery of a brand new URL is far faster, at roughly 20 hours."
  - question: "How long does core update recovery take?"
    answer: "Typically 3 to 6 months, and at worst 6 months to a year, because recovery is tied to the next core update running. Core updates themselves take 2 to 4 weeks to roll out."
  - question: "How long does a manual action take to be removed?"
    answer: "Typically 1 to 2 weeks after a successful reconsideration request, with the slowest case being 4 to 6 weeks, or considerably longer for dormant sites."
  - question: "Are these Google's official published timings?"
    answer: "No. They are Google's internal data presented by Gary Illyes at Search Central Live Deep Dive Europe on 2 October 2026 and relayed by attendees. Google has not published them as documentation."
  - question: "How do I get Google to recrawl a page faster?"
    answer: "Request indexing via URL Inspection in Search Console, update your sitemap with an accurate lastmod, and link to the page from somewhere crawled frequently. Make sure the change is substantial rather than cosmetic."
  - question: "Does requesting indexing guarantee my page gets indexed?"
    answer: "No. It can shorten the wait for a crawl, but it doesn't override quality judgments. Five of these processes list \"never\" as their slowest case, tied to quality."
howToSteps:
  - name: "Request indexing in Search Console"
    text: "Use URL Inspection to request indexing. It is the direct route for a handful of important URLs, it does not scale, and it is the fastest option for a specific page."
  - name: "Update and resubmit your sitemap"
    text: "Sitemap processing typically runs about 24 hours, far faster than the 30-day refresh cycle, so an accurate lastmod on a changed URL is the cheapest signal you can send."
  - name: "Link to the changed page from a frequently crawled page"
    text: "Link from your homepage or a hub page. Discovery runs on links, and a well-linked page is revisited more."
  - name: "Make the change substantial"
    text: "Google's documentation names cosmetic date changes as a search-engine-first warning sign. A genuinely updated page earns the recrawl; a touched timestamp does not."
  - name: "Check that you are not the bottleneck"
    text: "Crawl capacity drops when your server struggles, and can fall within seconds when Google backs off. A slow or erroring server limits everything above it."
---

![How long Google Search changes take: timings for crawling, indexing and serving processes](/images/google-search-change-timelines.webp)

*Source: Gary Illyes, Google Search Central Live Deep Dive Europe, Barcelona, 2 October 2026. Infographic via [Search Engine Land](https://searchengineland.com/).*

These figures come from one conference talk, not from documentation. This is a snapshot of that presentation, given on 2 October 2026 and last checked on 12 October 2026.

## Where Do These Numbers Come From?

A conference session, not a documentation page. Gary Illyes of Google presented them in a talk called "How long does it take to…?" at Search Central Live Deep Dive [Europe in Barcelona on 2 October 2026](https://developers.google.com/search/events).

### Are these official Google figures?

They are Google's own data, presented by a Google employee, and they have not been published by Google. ROAST's recap describes the material as "brand new information" drawn from internal analysis. Search Engine Journal reported that the slides were not on Google's events page at the time it wrote.

The distinction matters for how much weight to put on them. Conference numbers relayed by an attendee are good evidence, and they are not a specification you can hold Google to.

### How reliable are they?

Directionally strong, specifically soft. [Search Engine Journal's caveats](https://www.searchenginejournal.com/google-crawling-indexing-recovery-timing-ranges/591829/) are the right ones. "Typical" is never defined, no sample size is given, no measurement period is stated, and the ranges are "reference points, not deadlines."

Treat every figure below as an order of magnitude rather than a number. The difference between "about 20 hours" and "about 30 days" is the useful information. The difference between 20 and 24 hours is not.

## How Long Does Crawling Take?

Six processes. The gap between discovering a new URL and refreshing a known one is the most consequential pair of numbers in the whole set.

| Process | Typical | Slowest |
| ----- | ----- | ----- |
| Discovery (new URL) | ~20 hours | Weeks to never |
| Refresh (known URL) | ~30 days | Weeks to never |
| Sitemap processing | ~24 hours | Up to 14 days, or never (quality) |
| robots.txt update | ~24 hours | 25 hours |
| Crawl capacity update | 4 hours to 1-2 weeks | 1-3 weeks (in recovery) |
| Crawl demand update | ~20 hours | Weeks to months |

Discovery is fast, and refresh is slow. A brand new URL gets found in roughly a day. An existing URL you edited waits about a month for Google to come back and look.

That single contrast explains the most common frustration in SEO. New content appears quickly, while fixes to old content seem to do nothing for weeks.

One row to treat with caution. The robots.txt entry reads 24 hours typical and 25 hours slowest. A one-hour spread is implausible next to rows spanning days to months, and it looks like a transcription artifact somewhere in the chain rather than a real finding. ROAST and the trade coverage both carry it, so it is faithfully reported, and I would not build a decision on it.

## How Long Does Indexing Take?

Ten processes. Indexing itself is quick; the things around it are not.

| Process | Typical | Slowest |
| ----- | ----- | ----- |
| Rendering | Seconds to render, hours in the queue | Days to weeks |
| Meta annotations | 45-90 minutes | 1-4 days |
| Link annotations | Minutes to 1-3 weeks | Months |
| Indexing (end to end) | ~1.5 hours | Months or never (quality) |
| Removal | 1-3 weeks | Months |
| Canonicalisation change | 1-3 weeks | Months (conflicting signals) |
| Site move | 1-3 months | 6 months to 1 year+ |
| Structured data updates | Hours to 1-2 weeks | Weeks or never (quality) |
| Images | Hours to days | Weeks to months |
| Videos | Hours to days | Weeks to months (deep analysis) |

End-to-end indexing at about 1.5 hours is the surprise. Once a page has been crawled, getting it into the index is a matter of hours in the typical case. When people say a page "isn't indexing," the delay is almost always upstream, in discovery or recrawl, not in indexing itself.

[Canonicalisation](https://developers.google.com/search/docs/crawling-indexing/canonicalization) at 1 to 3 weeks, months with conflicting signals, is the row that explains why duplicate-content fixes feel unresponsive. And note the cause Google attaches to the slow case: conflicting signals. If your canonical, sitemap, internal links, and redirects disagree, you are the conflict.

## How Long Do Changes Take to Show in Search?

Seven processes, covering what the user actually sees.

| Process | Typical | Slowest |
| ----- | ----- | ----- |
| Removal in Search Console (owner) | ~2 hours | 24 hours |
| Snippet update | 1-2 days | Several weeks to months |
| Title update | 1-2 days | Several weeks to months |
| Text result image update | 1-2 weeks | Several weeks to months |
| Manual action removal | 1-2 weeks | 4-6 weeks, or much longer for dormant sites |
| Core update change | 3-6 months to recover | 6 months to 1 year (next core update) |
| Spam update change | 1-2 weeks (continuous) | Months (batch refreshes) |

ROAST also reports the rollout durations. Core updates take 2 to 4 weeks to roll out, and spam updates roll out in 1 to 2 days.

Core update recovery is the hardest number here. Three to six months typically, and up to a year at worst because recovery is tied to the next core update running. You cannot shorten that by working harder; you can only be ready when it arrives.

Manual action removal has a trap in it. One to two weeks typically, but "much longer for dormant sites." A site that stopped publishing and then files a reconsideration request is in the slow lane.

## Why Does the Real Wait Take Longer Than the Table Says?

Because the stages are sequential and the table lists them separately. ROAST reports that Gary noted many of these processes are linked, so delays stack.

This is the part no coverage does the arithmetic on, and it changes how you should read every row.

A title update is listed at 1 to 2 days. That is 1 to 2 days *from the point Google reprocesses the page*, not from when you saved the edit. [Google has to recrawl the page](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) first, and refreshing a known URL typically takes about 30 days.

Four worked examples, adding the stages the single row assumes:

| What you changed | Row you would quote | Realistic typical wait |
| ----- | ----- | ----- |
| Title on an existing page | 1-2 days | ~30-day refresh, then 1-2 days = about a month |
| New page published | ~1.5 hours indexing | ~20 hour discovery, then ~1.5 hours = about a day |
| Canonical tag fix | 1-3 weeks | ~30-day refresh, then 1-3 weeks = 5-7 weeks |
| Structured data fix | Hours to 1-2 weeks | ~30-day refresh, then hours to 2 weeks = 4-6 weeks |

This is my arithmetic, not Google's. Gary stated that processes are linked and delays stack; the specific additions above are my reasoning from that point applied to the published rows. Nobody measured these combined figures, and they assume the typical case at every stage. Treat them as a better mental model than the single row, not as a second set of data.

The practical consequence is the useful bit. If you want an edit to an existing page seen sooner than a month, the lever is getting it recrawled, not the edit itself.

## How Do You Make Google Recrawl Sooner?

Five actions, ordered by how much they help. None of them overrides the quality considerations attached to the "never" entries.

1. Request indexing in Search Console with URL Inspection. The direct route for a handful of important URLs. It does not scale, and it is the fastest option for a specific page.
2. Update and resubmit your sitemap. Sitemap processing typically runs about 24 hours, far faster than the 30-day refresh cycle, so an accurate lastmod on a changed URL is the cheapest signal you can send.
3. Link to the changed page from a page that gets crawled often. Your homepage or a hub page. Discovery runs on links, and a well-linked page is revisited more.
4. Make the change substantial. Google's documentation names cosmetic date changes as a search-engine-first warning sign. A genuinely updated page earns the recrawl; a touched timestamp does not.
5. Check that you are not the bottleneck. Crawl capacity drops when your server struggles, and ROAST's recap notes capacity can fall within seconds when Google backs off. A slow or erroring server limits everything above it.

## What Does "Never" Mean in This Table?

That the process may not complete at all, and ROAST reports that "never" usually ties to quality.

Five rows carry it: discovery of a new URL, refresh of a known URL, sitemap processing, end-to-end indexing, and structured data updates.

Read together, those five say something the industry tends to avoid: for pages Google judges low quality, the answer to "how long will this take" is not a longer number. It is that it may not happen. No amount of waiting, resubmitting, or sitemap pinging changes a quality judgement.

If a page has sat unindexed well past these ranges, the useful question is not how to speed up crawling. It is whether the page deserves to be indexed. Google's own list of [people-first content questions](/blog/people-first-content/) is the place to start.

## Where These Numbers Do Not Help?

Four situations, worth naming because a timing table invites false precision.

* As a deadline or an SLA. Search Engine Journal's framing is right: these are reference points, not deadlines. "Typical" is undefined and no sample size was given.
* For diagnosing a specific page. A table of population typicals tells you nothing about your URL. Search Console's Pages report does.
* Where quality is the blocker. Five rows end in "never." For those cases, the timing is irrelevant.
* As a stable fact. These are from one presentation on one date. Crawl behaviour changes, and nothing here is in documentation you can re-check.

## Conclusion

Two things in this data are worth carrying. End-to-end indexing typically takes about 90 minutes, so indexing is rarely the bottleneck. And refreshing a known URL typically takes about 30 days, which is the number that quietly governs nearly every edit you make to an existing page.

Put those together and the usual advice inverts. The question is rarely how to get indexed faster. It is how to get recrawled sooner, and whether the page clears the quality bar at all.

**Take one page you edited more than a week ago and run URL Inspection on it.** The report will tell you when Google last crawled it, which converts all of this from a population average into your actual answer for that URL. It takes under a minute.
