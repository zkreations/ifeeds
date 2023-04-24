import {
  Defaults,
  createScript,
  createStyle,
  sanitizeEntry,
  templating
} from '../utils'

export function initPlugin (config) {
  const Default = {
    ...Defaults,
    ...config
  }

  const template = `<div class='feeds-item'>
      <a target="_blank" href='{{url}}' class='feeds-header'>
        <img class='feeds-image' src='${Default.direction === 'column' ? '{{thumbnail}}' : '{{image}}'}' alt='{{title}}' />
      </a>
      <div class='feeds-content'>
        <a class='feeds-category' target="_blank" href='${Default.url}search/label/{{category}}'>{{category}}</a>
        <a class='feeds-link' target="_blank" href='{{url}}'>{{title}}</a>
      </div>
    </div>`

  const CONTAINER = document.querySelector('.widget-feeds')
  const label = Default.label

  createScript(`${Default.url}feeds/posts/default${label ? `/-/${label}` : ''}?alt=json-in-script&callback=ifeeds&max-results=${Default.max}`)

  window.ifeeds = function (json) {
    if (!json.feed.entry || !CONTAINER) {
      return
    }

    if (Default.styles) {
      createStyle(`
        .widget-feeds {
          --feeds-margin: 1rem;
          --feeds-gap: 1.25rem;
          --feeds-border: ${Default.border};
          padding: var(--feeds-gap);
          display: flex;
          max-width: 100%;
          border: 1px solid var(--feeds-border);
          border-radius: .5rem;
          background: var(--feeds-background, ${Default.background});
        }

        .widget-feeds,
        .widget-feeds * {
          box-sizing: border-box;
        }

        .feeds-item {
          display: flex;
          align-items: flex-start;
        }

        .feeds-column,
        .feeds-row .feeds-item {
          flex-direction: column;
        }

        .feeds-column .feeds-header {
          margin-right: var(--feeds-margin);
          width: 80px;
        }

        .feeds-row .feeds-header {
          margin-bottom: var(--feeds-margin);
          width: 100%;
          --feeds-ratio-y: 9;
          --feeds-ratio-x: 16;
        }

        .feeds-header {
          flex: none;
          position: relative;
          overflow: hidden;
          border-radius: 0.5rem;
        }
        
        .feeds-header::before {
          content: "";
          display: block;
          padding-top: calc(var(--feeds-ratio-y, 1)/ var(--feeds-ratio-x, 1) * 100%);
        }
        
        .feeds-link {
          text-decoration: none;
          color: var(--feeds-title-color, ${Default.title});
          font-weight: 500;
          font-size: 1rem;
          margin-top: .5rem;
          display: block;
        }

        .feeds-category {
          text-transform: capitalize;
          text-decoration: none;
          display: inline-block;
          border-radius: 5rem;
          padding: .25rem .875rem;
          background-color: var(--feeds-category-bg, ${Default.categorybg});
          color: var(--feeds-category-color, ${Default.category});
          font-size: .875rem;
          font-weight: 400;
        }

        .feeds-image {
          object-fit: cover;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          min-height: 100%;
          transform: translate(-50%, -50%);
        }

        .feeds-column .feeds-item + * {
          margin-top: var(--feeds-gap);
          padding-top: var(--feeds-gap);
          border-top: 1px solid var(--feeds-border);
        }

        .feeds-row .feeds-item + * {
          margin-left: var(--feeds-gap);
        }

        .feeds-row {
          overflow-x: auto;
        }

        .feeds-row .feeds-item {
          flex: 1 1 100%;
          min-width: 250px;
        }

        .feeds-row .feeds-content {
          text-align: center;
          width: 100%;
        }`)
    }

    CONTAINER.className = `widget-feeds feeds-${Default.direction}`
    CONTAINER.innerHTML = ''

    json.feed.entry.forEach((entry) => {
      const data = sanitizeEntry(entry, Default)
      CONTAINER.innerHTML += templating(template, data)
    })
  }
}
