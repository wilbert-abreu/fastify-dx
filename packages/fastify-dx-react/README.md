# fastify-dx-react [![NPM version](https://img.shields.io/npm/v/fastify-dx-react.svg?style=flat)](https://www.npmjs.com/package/fastify-dx-react) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

## Quickstart

First install `degit`, then:

```bash
mkdir project
cd project
degit fastify/fastify-dx/starters/react
npm i
```

That'll get you a starter boilerplate to work with, with all essentials included.

## Install

If you're starting a project from scratch, you'll need these packages installed:

```bash
npm i fastify fastify-vite fastify-dx-react -P
npm i @vitejs/plugin-react -D
```

## Usage

Basic server setup:

```js
import Fastify from 'fastify'
import FastifyVite from 'fastify-vite'
import FastifyDXReact from 'fastify-dx-react'

const server = Fastify()

await server.register(FastifyVite, { 
  root: import.meta.url, 
  renderer: FastifyDXReact,
})

await server.vite.ready()
await server.listen(3000)
```

The example above assumes you're following [fastify-vite](https://github.com/fastify/fastify-vite)'s convention of having a `client` folder with an `index.js` file, which is automatically resolved as your `clientModule` setting. But in order to have a flat initial setup, you can manually set `clientModule` as demonstrated by the [starter boilerplate](), which sets `/client.js` as `clientModule`.

Minimal `vite.config.js` file:

```js
import { dirname } from 'path'
import viteReact from '@vitejs/plugin-react'
import viteReactFastifyDX from 'fastify-dx-react/plugin'

export default {
  root: dirname(new URL(import.meta.url).pathname),
  plugins: [
    viteReact({ jsxRuntime: 'classic' }),
    viteReactFastifyDX(),
  ],
}
```

## Routing mode

By default, routes are loaded from the `<project-root>/pages` folder, where `<project-root>` refers to the `root` setting in `vite.config.js`. The route paths are dynamically inferred from the directory structure, very much like Next.js and Nuxt.js.

Dynamic route parameters follow the [Next.js convention](https://nextjs.org/docs/basic-features/pages#pages-with-dynamic-routes) (`[param]`), but that can be overriden by using the `paramPattern` plugin option. For example, the following configuration switches the param pattern to the [Remix convention](https://remix.run/docs/en/v1/guides/routing#dynamic-segments) (`$param`):

```js
// ...
export default {
  plugins: [
    // ...
    viteReactFastifyDX({ paramPattern: /\$(\w+)/ }),
  ],
}
```

You can also change the glob pattern used to determine where to route modules from. Since this setting is passed to [Vite's glob importers](https://vitejs.dev/guide/features.html#glob-import), the value needs to be a string:

```js
// ...
export default {
  plugins: [
    // ...
    viteReactFastifyDX({ globPattern: '/views/**/*.jsx' }),
  ],
}
```

Finally, you also can export a `path` constant from your route modules, in which case its value will be used to **override the dynamically inferred paths from the directory structure**.

## Rendering mode

Following the URMA specification, Fastify DX's route module can be set to be universally rendered (default behavior), server-side rendered in streaming mode, server-side rendered only (client gets no JavaScript) or client rendered only (no rendering takes place on the server).

<table>
<tr>
<td width="400px" valign="top">

### `serverOnly`

If a route module exports `serverOnly` set to `true`, only SSR will take place. The client gets the server-side rendered markup without any accompanying JavaScript or data hydration.

You should use this setting to deliver lighter pages when there's no need to run any code on them, such as statically generated content sites.

</td>
<td width="600px"><br>

```jsx
export const serverOnly = true
  
export function Index () {
  return <p>No JavaScript sent to the browser.</p>
}
```

</td>
</tr>
</table>


<table>
<tr>
<td width="400px" valign="top">

### `clientOnly`

If a route module exports `clientOnly` set to `true`, no SSR will take place, only data fetching and data hydration. The client gets the empty container element (the one that wraps `<!-- element -->` in `index.html`) and all rendering takes place on the client only.

You can use this setting to save server resources on internal pages where SSR makes no significant diference for search engines or UX in general, such as a password-protected admin section.
  
</td>
<td width="600px"><br>

```jsx
export const clientOnly = true
  
export function Index () {
  return <p>No pre-rendered HTML sent to the browser.</p>
}
```

</td>
</tr>
</table>


## Decoupled `<head>`


## Data fetching


