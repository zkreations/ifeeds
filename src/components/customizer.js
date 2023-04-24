import { Defaults } from '../utils'
import { initPlugin } from './plugin'

const RESULTS = document.getElementById('dev-results')
const CONTAINER = document.getElementById('dev-customizer')

const copied = (content, message) => {
  if (!content) {
    return
  }

  content.classList.add('copied')
  content.innerText = message.action

  // Cancel previous timeout
  if (content.timeoutId) {
    clearTimeout(content.timeoutId)
  }

  // Create new timeout
  content.timeoutId = setTimeout(function () {
    content.classList.remove('copied')
    content.innerText = message.original
    content.timeoutId = null // Clear timeoutId
  }, 2000)
}

export function initCustomizer (config) {
  const Default = {
    ...Defaults,
    ...config
  }

  if (!CONTAINER || !RESULTS) {
    return
  }

  const textarea = RESULTS.querySelector('textarea')
  const button = RESULTS.querySelector('button')
  const buttonText = button.innerText

  function copyArea (textarea, data) {
    textarea.value = `<div class="widget-feeds"></div>
<script src='https://cdn.jsdelivr.net/npm/ifeeds@1/dist/js/feeds.min.js'></script>
<script>Feeds.initPlugin({
  max: ${data.max}, direction: '${data.direction}', background: '${data.background}', title: '${data.title}', category: '${data.category}', categorybg: '${data.categorybg}', border: '${data.border}', url: '${data.url}', label: '${data.label}'
})</script>`
  }

  button.onclick = () => {
    navigator.clipboard.writeText(textarea.value).then(function () {
      copied(button, {
        action: 'Código copiado!',
        original: buttonText
      })
    })
  }

  initPlugin(Default)
  copyArea(textarea, Default)

  Array.from(CONTAINER.querySelectorAll('input'))
    .forEach((input) => {
      input.addEventListener('input', (event) => {
        Default[event.target.name] = event.target.value
        initPlugin(Default)
        copyArea(textarea, Default)
      })
    })
}
