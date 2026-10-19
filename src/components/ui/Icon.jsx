// Iconify mask icon, same markup as the original: <span class="iconify i-solar:NAME">.
// Mask CSS lives in src/icons.css. Size with size-* and colour with text-*.
export default function Icon({ name, className = '', ...rest }) {
  return <span className={`iconify i-${name} ${className}`} aria-hidden="true" {...rest} />
}
