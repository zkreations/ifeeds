# ifeeds

One of the most useful features of Blogger is its ability to generate feeds, and based on this, I developed a plugin that creates widgets, allowing visitors with their own blogs and who enjoy your content to display your latest posts as a sign of appreciation.

## Install

### npm

```
npm i ifeeds
```

### cdn

```html
<script href="https://cdn.jsdelivr.net/npm/ifeeds@1/dist/js/feeds.min.js"></script>
```

## Basic Usage

### Builder Mode

It provides controls for users to configure the plugin, this would be the minimum structure:

```html
<!-- Customizer -->
<div id="dev-customizer">
  <label>
    <input type="radio" name="direction" value="column" checked=""/> Column
  </label>
  <label>
    <input type="radio" name="direction" value="row"/> Row
  </label> 
  <input class="dev-input" type="number" value="4" min="3" max="9" name="max"/>
  <input class="dev-input" type="text" value="#ffffff" name="background"/>
  <input class="dev-input" type="text" value="#212121" name="title"/>
  <input class="dev-input" type="text" value="#212121" name="category"/>
  <input class="dev-input" type="text" value="#f1f1f1" name="categorybg"/>
  <input class="dev-input" type="text" value="#e6e6e6" name="border"/>
  <input class="dev-input" type="text" value="" name="label"/>
</div>

<!-- Preview -->
<div class="widget-feeds"></div>

<!-- Result -->
<div id="dev-results">
  <textarea spellcheck="false"></textarea>
  <button>Copy code</button>
</div>
```

Finally (after including **feeds.js**), use the `initCustomizer` method to use the script in "Creator" mode:

```js
Feeds.initCustomizer()
```

Example: [codepen.io/zkreations/pen/poOvXVY](https://codepen.io/zkreations/pen/poOvXVY)
Custom example: [codepen.io/zkreations/pen/zYJxZyR](https://codepen.io/zkreations/pen/zYJxZyR)

### Plugin Mode


In this mode, only the container is required:

```html
<div class="widget-feeds"></div>
```

Now you need to initialize it using the `initPlugin` method to display the feed:

```js
Feeds.initPlugin()
```

## Options

Both previously mentioned methods share the same options, here is a table with more information:

| Option         | Type       | Default
| -------------- | ---------- | ---------
|  `url`         | string     | `origin`
|  `max`         | number     | `5`
|  `direction`   | string     | `column`
|  `image`       | string     | `https://i.imgur.com/snnjdGS.png`
|  `imageSize`   | string     | `w300-h240-c`
|  `title`       | string     | `#212121`
|  `category`    | string     | `#212121`
|  `categorybg`  | string     | `#f1f1f1`
|  `border`      | string     | `#e6e6e6`
|  `background`  | string     | `#ffffff`
|  `label`       | string     | `#ffffff`
|  `styles`      | boolean    | `true`

## License

**feeds.js** is licensed under the MIT License

Inspiration: [somoskudasai](https://somoskudasai.com/webmasters/)
