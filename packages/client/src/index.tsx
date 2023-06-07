import { useSugar } from 'plaited'
import { css } from 'plaited'

import {  FormTemplate, Form } from './form.js'

/** initialize our custom element form */
Form()

/** create some basic app styles and reusable values */
const [ _, stylesheet ] = css`
:root {
  --color-yellow: #ffec19;
  --color-black: #000;
  --color-blue: #24f2ff;
  --font-size: 18px;
  --line-height: 1.5rem;
  --color-text-primary: var(--color-yellow);
  --gf-action-shadow: 2px 2px 0px 0px var(--color-blue), 4px 4px 0px 0px var(--color-blue), 6px 6px 0px 0px var(--color-blue), 8px 8px 0px 0px var(--color-blue);
  --gf-action-shadow-hover: 2px 2px 0px 0px var(--color-blue), 4px 4px 0px 0px var(--color-blue);
  --gf-ring-offset-shadow: 0 0 #0000;
  --gf-ring-shadow: 0 0 #0000;
}
body {
  height: 100vh;
  width: 100vw;
  margin: 0;
  font-size: 16px;
  font-family: sans-serif;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
  background-color: var(--color-black);
  color: var(--color-yellow);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
`

/** sugar up the DOM */
const root = useSugar(document.querySelector('body'))

/** insert our declarative shadow dom template */
root.render(
  <div { ...stylesheet}>
    <FormTemplate />
  </div>, 
  'beforeend'
)
