// Placeholder bodies for the content templates. No real article, resource or legal text is stored
// in the clone (SPEC_CONTENT content policy); these neutral, generic passages exist only to
// exercise every prose style (§5.6) and give the TOC its headings.

import { SIGNUP } from './data'

// §5.8 intent detection, tested against `${slug} ${title}`.toLowerCase()
export function articleIntent(post) {
  const s = `${post.slug} ${post.title}`.toLowerCase()
  if (/pricing|how-much|-costs?$|cost-of-/.test(s)) return 'pricing'
  if (/\bvs\b|-vs-|alternative|competitor|compare|comparison|\bbest-\d|top-\d/.test(s)) return 'comparison'
  if (/how-to|^how-|guide|tutorial|automate|automation-for|connect-|integrate|examples?$/.test(s)) return 'how-to'
  return 'default'
}

// §5.8 inline anchor copy by intent (lead / link). Only the first ("anchor") is rendered: the
// placeholder body is short, so the mid-article anchor (≥12,000 chars) never triggers.
export const ANCHORS = {
  default: ['Everything below works on Activepieces’ free plan.', 'Start without code or a credit card.'],
  'how-to': ['This takes minutes, not a project:', 'automate it in Activepieces free.'],
  comparison: ['The fastest way to settle a shortlist is to try one.', 'Activepieces is free to try, no credit card.'],
  pricing: ['If you are running this arithmetic for your own team,', 'see what the same workload costs on Activepieces.'],
}

export const ARTICLE_TOC = [
  { id: 'placeholder-planning-the-flow', text: 'Planning the flow' },
  { id: 'placeholder-building-it-step-by-step', text: 'Building it step by step' },
  { id: 'placeholder-measuring-the-result', text: 'Measuring the result' },
  { id: 'frequently-asked-questions', text: 'Frequently asked questions' },
]

// Article body as h2-delimited chunks (§5.5). Returns an array of { key, inline?, body }.
export function articleChunks(post, intent) {
  const [lead, link] = ANCHORS[intent]
  const [t1, t2, t3, t4] = ARTICLE_TOC
  return [
    {
      key: 'intro',
      body: (
        <>
          <aside className="tldr">
            <p className="tldr-label">Summary</p>
            <p>This is placeholder text. The full article is published on activepieces.com.</p>
            <ul>
              <li>Placeholder point about choosing a trigger.</li>
              <li>Placeholder point about mapping data between steps.</li>
              <li>Placeholder point about testing before going live.</li>
            </ul>
          </aside>
          <p>
            Lorem ipsum dolor sit amet, a placeholder lead paragraph about automating repetitive work. Consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
          </p>
        </>
      ),
    },
    {
      key: 'anchor',
      inline: true,
      body: (
        <p>
          {lead} <a href={SIGNUP}>{link}</a>
        </p>
      ),
    },
    {
      key: t1.id,
      body: (
        <>
          <h2 id={t1.id}>{t1.text}</h2>
          <p>
            Placeholder paragraph with <a href="/pieces">an inline link</a> and <strong>a strong phrase</strong>. Nemo
            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.
          </p>
          <h3>Placeholder subheading</h3>
          <p>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
            numquam eius modi tempora incidunt.
          </p>
          <ul>
            <li>Placeholder list item one</li>
            <li>Placeholder list item two</li>
            <li>Placeholder list item three</li>
            <li>Placeholder list item four</li>
          </ul>
          <p>
            Placeholder sentence that mentions a setting such as <code>retryOnFailure</code> inline, followed by more
            filler text to round out the paragraph.
          </p>
        </>
      ),
    },
    {
      key: t2.id,
      body: (
        <>
          <h2 id={t2.id}>{t2.text}</h2>
          <p>
            Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel
            illum qui dolorem eum fugiat quo voluptas nulla pariatur.
          </p>
          <blockquote className="pull">
            <p>A placeholder pull quote about doing less busywork.</p>
          </blockquote>
          <h3>Placeholder steps</h3>
          <ol>
            <li>Placeholder first step</li>
            <li>Placeholder second step</li>
            <li>Placeholder third step</li>
          </ol>
          <img src={post.cover.local} alt="" loading="lazy" decoding="async" width="1600" height="900" />
        </>
      ),
    },
    {
      key: t3.id,
      body: (
        <>
          <h2 id={t3.id}>{t3.text}</h2>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores.
          </p>
          <table>
            <thead>
              <tr>
                <th>Column A</th>
                <th>Column B</th>
                <th>Column C</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Placeholder</td>
                <td>Value</td>
                <td>10</td>
              </tr>
              <tr>
                <td>Placeholder</td>
                <td>Value</td>
                <td>20</td>
              </tr>
              <tr>
                <td>Placeholder</td>
                <td>Value</td>
                <td>30</td>
              </tr>
            </tbody>
          </table>
          <blockquote>
            <p>A placeholder blockquote. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.</p>
          </blockquote>
          <pre>
            <code>
              <span className="token punctuation">{'{'}</span>
              {'\n  '}
              <span className="token property">"trigger"</span>
              <span className="token operator">:</span> <span className="token string">"placeholder.event"</span>
              <span className="token punctuation">,</span>
              {'\n  '}
              <span className="token property">"steps"</span>
              <span className="token operator">:</span> <span className="token number">3</span>
              <span className="token punctuation">,</span>
              {'\n  '}
              <span className="token property">"enabled"</span>
              <span className="token operator">:</span> <span className="token boolean">true</span>
              <span className="token punctuation">,</span>
              {'\n  '}
              <span className="token comment">{'// placeholder comment'}</span>
              {'\n  '}
              <span className="token property">"name"</span>
              <span className="token operator">:</span> <span className="token string">"example-flow"</span>
              {'\n'}
              <span className="token punctuation">{'}'}</span>
            </code>
          </pre>
          <hr />
          <h4>Placeholder minor heading</h4>
          <p>
            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime
            placeat facere possimus.
          </p>
        </>
      ),
    },
    {
      key: t4.id,
      body: (
        <>
          <h2 id={t4.id}>{t4.text}</h2>
          <h3>Placeholder question one?</h3>
          <p>Placeholder answer. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus.</p>
          <h3>Placeholder question two?</h3>
          <p>Placeholder answer. Omnis voluptas assumenda est, omnis dolor repellendus et harum quidem rerum facilis.</p>
        </>
      ),
    },
  ]
}

// Resource detail body (§8): one chunk, no TL;DR or pull quote; ≥3 h2s so the right TOC renders.
export const RESOURCE_TOC = [
  { id: 'placeholder-overview', text: 'Overview' },
  { id: 'placeholder-how-it-works', text: 'How it works' },
  { id: 'placeholder-getting-started', text: 'Getting started' },
]

export function ResourceBody() {
  const [a, b, c] = RESOURCE_TOC
  return (
    <div className="blog-prose">
      <p>
        This is placeholder text. The full page is published on activepieces.com. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt.
      </p>
      <h2 id={a.id}>{a.text}</h2>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris with <a href="/pieces">an inline link</a>{' '}
        and <strong>a strong phrase</strong>. Duis aute irure dolor in reprehenderit.
      </p>
      <h2 id={b.id}>{b.text}</h2>
      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</p>
      <ul>
        <li>Placeholder list item one</li>
        <li>Placeholder list item two</li>
        <li>Placeholder list item three</li>
      </ul>
      <h2 id={c.id}>{c.text}</h2>
      <ol>
        <li>Placeholder first step</li>
        <li>Placeholder second step</li>
        <li>
          Placeholder third step with <code>inline code</code>
        </li>
      </ol>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
    </div>
  )
}
