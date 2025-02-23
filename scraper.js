// Note:
//
// This is very WIP. I think we should use Postgres to index the URLs and text.
// It has nice full text search capabilities.
//
// We could have it do something like scrape the websites for everyone in the Slack.
//
// - Zach
import { parse } from "node-html-parser"

async function indexUrl(url, depth=0) {
  if (depth < 0) {
    return
  }

  const response = await fetch(url)
  const html = await response.text()

  const root = parse(html)
  
  let text = root.textContent

  let links = root.querySelectorAll('a').map(link => {
    const href = link.getAttribute('href')
    if (!href) return null
    try {
      // resolve relative urls
      return new URL(href, url).href
    } catch {
      return null
    }
  }).filter(Boolean)
  
  console.log(text) // todo clean up text
  console.log(links.toString())

  for (let link of links) {
    await indexUrl(link, depth - 1)
  }
}

await indexUrl('https://zachlatta.com', 2)