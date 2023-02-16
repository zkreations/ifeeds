(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Feeds = factory());
})(this, (function () { 'use strict';

  const REG_EXP = /s\d{2}(-w\d{3}-h\d{3})?-c/;
  function getFirstImage(code) {
    const temporal = document.createElement('div');
    temporal.innerHTML = code;
    const img = temporal.querySelector('img');
    return img ? img.src : '';
  }
  function getAlternateLink(links) {
    for (const link of links) {
      if (link.rel === 'alternate') {
        return link.href;
      }
    }
  }
  const Defaults = {
    url: window.location.origin + '/',
    max: 5,
    direction: 'column',
    image: 'https://i.imgur.com/snnjdGS.png',
    imageSize: 'w300-h240-c',
    title: '#212121',
    category: '#212121',
    categorybg: '#f1f1f1',
    border: '#e6e6e6',
    background: '#ffffff',
    label: '',
    styles: true
  };
  function createScript(src) {
    const $script = document.createElement('script');
    $script.src = src;
    document.body.appendChild($script).parentNode.removeChild($script);
  }
  function createStyle(string) {
    const styleElement = document.getElementById('widget-feeds');
    if (styleElement) {
      styleElement.remove();
    }
    const style = document.createElement('style');
    style.id = 'widget-feeds';
    style.textContent = string;
    document.head.appendChild(style);
  }
  function isYoutubeUrl(url) {
    if (url == null || typeof url !== 'string') return false;
    return url.includes('img.youtube.com');
  }
  function resizeImage(imgUrl, size) {
    if (isYoutubeUrl(imgUrl)) {
      return imgUrl.replace('default', size);
    }
    return imgUrl.replace(REG_EXP, size);
  }
  function templating(template, data) {
    return template.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key]);
  }
  function sanitizeEntry(entry, dataset) {
    const content = entry.content ? entry.content.$t : entry.summary.$t;
    const category = entry.category !== null ? entry.category : false;
    const image = entry.media$thumbnail ? entry.media$thumbnail.url : getFirstImage(content) || dataset.image;
    return {
      url: getAlternateLink(entry.link),
      title: entry.title.$t,
      img: resizeImage(image, isYoutubeUrl(image) ? 'mqdefault' : dataset.imageSize),
      category: category ? category[0].term : 'no category'
    };
  }

  function initPlugin(config) {
    const Default = {
      ...Defaults,
      ...config
    };
    const template = `<div class='feeds-item'>
      <a target="_blank" href='{{url}}' class='feeds-header'>
        <img class='feeds-image' src='{{img}}'/>
      </a>
      <div class='feeds-content'>
        <a class='feeds-category' target="_blank" href='${Default.url}search/label/{{category}}'>{{category}}</a>
        <a class='feeds-link' target="_blank" href='{{url}}'>{{title}}</a>
      </div>
    </div>`;
    const CONTAINER = document.querySelector('.widget-feeds');
    const label = Default.label;
    createScript(`${Default.url}feeds/posts/default${label ? `/-/${label}` : ''}?alt=json-in-script&callback=ifeeds&max-results=${Default.max}`);
    window.ifeeds = function (json) {
      if (!json.feed.entry || !CONTAINER) {
        return;
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
        }
      `);
      }
      CONTAINER.className = `widget-feeds feeds-${Default.direction}`;
      CONTAINER.innerHTML = '';
      json.feed.entry.forEach(entry => {
        const data = sanitizeEntry(entry, Default);
        CONTAINER.innerHTML += templating(template, data);
      });
    };
  }

  const RESULTS = document.getElementById('dev-results');
  const CONTAINER = document.getElementById('dev-customizer');
  function copied(button) {
    const restore = button.innerText;
    button.innerText = 'Código copiado';
    setTimeout(function () {
      button.innerText = restore;
    }, 2000);
  }
  function initCustomizer(config) {
    const Default = {
      ...Defaults,
      ...config
    };
    if (!CONTAINER || !RESULTS) {
      return;
    }
    const textarea = RESULTS.querySelector('textarea');
    const button = RESULTS.querySelector('button');
    function copyArea(textarea, data) {
      textarea.value = `<div class="widget-feeds"></div>
<script src='https://cdn.jsdelivr.net/npm/ifeeds@1/dist/js/feeds.min.js'></script>
<script>Feeds.initPlugin({
  max: ${data.max}, direction: '${data.direction}', background: '${data.background}', title: '${data.title}', category: '${data.category}', categorybg: '${data.categorybg}', border: '${data.border}', url: '${data.url}', label: '${data.label}'
})</script>`;
    }
    button.onclick = () => {
      navigator.clipboard.writeText(textarea.value).then(function () {
        copied(button);
      });
    };
    initPlugin(Default);
    copyArea(textarea, Default);
    Array.from(CONTAINER.querySelectorAll('input')).forEach(input => {
      input.addEventListener('input', event => {
        Default[event.target.name] = event.target.value;
        initPlugin(Default);
        copyArea(textarea, Default);
      });
    });
  }

  var main = {
    initPlugin,
    initCustomizer
  };

  return main;

}));
