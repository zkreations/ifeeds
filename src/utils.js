// Regex to get the image size
const REG_EXP = /s\d{2}(-w\d{3}-h\d{3})?-c/

// Get the first image from the content
export function getFirstImage (code) {
  const temporal = document.createElement('div')
  temporal.innerHTML = code

  const img = temporal.querySelector('img')
  return img ? img.src : ''
}

// Get real post link
export function getAlternateLink (links) {
  for (const link of links) {
    if (link.rel === 'alternate') {
      return link.href
    }
  }
}

// Default values
export const Defaults = {
  url: window.location.origin + '/',
  max: 5,
  direction: 'column',
  image: 'https://i.imgur.com/snnjdGS.png',
  imageSize: 'w300-h240-c',
  thumbnailSize: 's80-c',
  title: '#212121',
  category: '#212121',
  categorybg: '#f1f1f1',
  border: '#e6e6e6',
  background: '#ffffff',
  label: '',
  styles: true
}

// Create and remove script
export function createScript (src) {
  const $script = document.createElement('script')
  $script.src = src
  document.body.appendChild($script).parentNode.removeChild($script)
}

// Create and minify style
export function createStyle (string) {
  const styleElement = document.getElementById('widget-feeds')

  if (styleElement) {
    styleElement.remove()
  }

  string = string.replace(/\s+/g, ' ')
  string = string.replace(/\s*([:;{},])\s*/g, '$1')
  string = string.trim()

  const style = document.createElement('style')
  style.id = 'widget-feeds'
  style.textContent = string
  document.head.appendChild(style)
}

// Check if the image is from youtube
export function isYoutubeUrl (url) {
  if (url == null || typeof url !== 'string') return false
  return url.includes('img.youtube.com')
}

// Resize the image
export function resizeImage (imgUrl, size) {
  if (isYoutubeUrl(imgUrl)) {
    return imgUrl.replace('default', size)
  }
  return imgUrl.replace(REG_EXP, size)
}

// Templating
export function templating (template, data) {
  return template
    .replace(/\{\{(.*?)\}\}/g, (_, key) => data[key])
}

// Sanitize the entry
export function sanitizeEntry (entry, dataset) {
  const content = entry.content ? entry.content.$t : entry.summary.$t
  const category = entry.category !== null ? entry.category : false

  const image = entry.media$thumbnail
    ? entry.media$thumbnail.url
    : getFirstImage(content) || dataset.image

  return {
    url: getAlternateLink(entry.link),
    title: entry.title.$t,
    image: resizeImage(image, isYoutubeUrl(image) ? 'mqdefault' : dataset.imageSize),
    thumbnail: resizeImage(image, isYoutubeUrl(image) ? 'mqdefault' : dataset.thumbnailSize),
    category: category ? category[0].term : 'no category'
  }
}
