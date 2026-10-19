// The site's single `ui-button` (CLONE_SPEC 0.8). Classes copied from the saved HTML.
// Do not pass className values that conflict with the size's h/px/text (Tailwind v3 does not
// guarantee override order); write the full class string by hand for one-off variants instead.
const BASE =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.99] motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

export const BUTTON_SIZES = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-12 px-7 text-base',
  xl: 'h-12.5 px-8 text-[17px]',
}

export const BUTTON_VARIANTS = {
  brand: 'bg-primary-700 text-white hover:bg-primary-800 focus-visible:outline-primary-700',
  solid: 'bg-ink-950 text-white hover:bg-ink-900 focus-visible:outline-primary-700',
  secondary: 'bg-ink-50 text-ink-950 shadow-edge hover:bg-ink-100 hover:shadow-edge-hover focus-visible:outline-primary-700',
  glass: 'bg-white/70 text-ink-950 backdrop-blur-md hover:bg-white focus-visible:outline-primary-700',
  // SPEC_MARKETING §0.3 (used on dark backgrounds, /security hero)
  light: 'bg-white text-ink-950 hover:bg-ink-100 focus-visible:outline-white',
  'quiet-light': 'text-white hover:bg-white/10 focus-visible:outline-white',
}

export function buttonClasses(size = 'md', variant = 'brand', extra = '') {
  return [BASE, size && BUTTON_SIZES[size], variant && BUTTON_VARIANTS[variant], extra].filter(Boolean).join(' ')
}

export default function Button({ href, size = 'md', variant = 'brand', className = '', children, ...rest }) {
  const cls = buttonClasses(size, variant, className)
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  )
}
