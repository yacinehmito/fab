import { ServeHtmlArgs, ServeHtmlMetadata } from './types'
import { FabPluginRuntime, matchPath } from '@fab/core'
import mustache from 'mustache'
import { DEFAULT_INJECTIONS } from './constants'
import { generateReplacements } from './injections/env'

// Todo: this should be part of the context.
// Maybe it should be optional though, with this as the fallback.
const getNonce = () => {
  return Math.random()
    .toString(16)
    .slice(2)
}

export const runtime: FabPluginRuntime<ServeHtmlArgs, ServeHtmlMetadata> = (
  args: ServeHtmlArgs,
  metadata: ServeHtmlMetadata
) => {
  const { injections = DEFAULT_INJECTIONS } = args

  const htmls = metadata.serve_html.htmls
  const writer = new mustache.Writer()

  return async function({ url, settings }) {
    const { pathname } = url

    const html = matchPath(htmls, pathname)
    if (html) {
      const replacements: { [token: string]: string } = {
        OPEN_TRIPLE: '{{{',
        OPEN_DOUBLE: '{{',
      }

      if (injections.env) {
        Object.assign(replacements, generateReplacements(injections.env, settings))
      }

      const rendered = writer.renderTokens(
        // @ts-ignore
        html,
        new mustache.Context(replacements),
        null,
        null
      )

      return new Response(rendered, {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }

    return undefined
  }
}