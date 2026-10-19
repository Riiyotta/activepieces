import EmbedHero from '../components/embed/EmbedHero'
import EmbedBento from '../components/embed/EmbedBento'
import Faq from '../components/Faq'
import { usePageClosing } from '../components/PageMetaContext'
import usePageHead from './usePageHead'

// /embed (SPEC_MARKETING §6): product hero with the flow-canvas demo → bento (8 cells) → FAQ.

const FAQ = [
  ['How do our users end up logged in?', 'They do not log in twice. You sign a short-lived RS256 token in your backend carrying your own ids, and the SDK exchanges it for a session. If the user and project exist, the token signs them in; if not, both are created. The role is in the same token, so the same person can be an editor in one workspace and a viewer in another.'],
  ['How much of the interface can we actually change?', 'The URL is a subdomain you own, and you pass your own font and light or dark mode. The sidebar, folder tree, flow name, search, import and export, and the tables interface are each a flag you can switch off, and navigation can be a single home button that calls your own router. The formula editor links to your documentation rather than ours.'],
  ['Can different customers see different integrations?', 'Yes, with one claim in the token rather than a separate deployment. You build a named set in the platform admin, choosing the integrations and even which of their actions and triggers are visible. Whichever set the token names is the catalog that customer sees.'],
  ['Do our users have to reconnect accounts they already gave us?', 'Not if you already hold the credential. Create the connection over the API when you provision the project, and the app is authorized before the customer opens the builder. When you do want them to connect something, calling connect() from your own button opens just that dialog.'],
  ['Does the browser URL stay in step with what they are looking at?', 'Yes, but you have to wire it up. By default the embedded routes leave your address bar alone, which breaks the back button and makes links unshareable. The SDK gives you a handler that fires on every route change inside the frame, and a navigate method to push a route back into it.'],
  ['What does it cost, and what do we need to set up first?', 'It is a contracted plan billed yearly, sized on how many of your customers automate and how much they run. On our cloud, setup is a subdomain with DNS verification, the origins allowed to frame it, and a signing key. Self-hosted skips the first two, since it already runs on your domain.'],
]

const CLOSING = {
  h2: 'Tell us what you want your users to build.',
  lede: 'Embedding is a contracted plan, so we size it with you. The docs cover the SDK if you want to look first.',
}

export default function Embed() {
  usePageHead(
    'Put a flow builder inside your product | Activepieces',
    'Your customers build automations without leaving your app. Your domain, your branding, 760+ integrations, and a separate workspace for every customer.',
  )
  usePageClosing(CLOSING)
  return (
    <div>
      <EmbedHero />
      <EmbedBento />
      <Faq section="embed-faq" heading="Common questions." items={FAQ} />
    </div>
  )
}
