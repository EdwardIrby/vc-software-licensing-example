import {
  isle,
  PlaitProps,
  PlaitedElement,
  css,
} from 'plaited'

/** styles for app  */
const [ cls, stylesheet ] = css`
  .form {
    width: 400px;
    display: inline-grid;
    column-gap: 16px;
    row-gap: 4px;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      "a a"
      "b c";
  }
  .label {
    grid-area: a;
  }
  .input {
    all: unset;
    grid-area: b;
    border: 2px solid var(--color-blue);
    padding: 12px 22px 14px 22px;
    box-shadow: var(--gf-ring-offset-shadow,0 0 #0000),var(--gf-ring-shadow,0 0 #0000),var(--gf-action-shadow);
    display: inline-block;
    font-size: var(--font-size);
    line-height: var(--line-height);
    background: var(--color-black);
  }
  .button {
    --button-shadow: var(--gf-action-shadow);
    grid-area: c;
    color: var(--color-blue);
    border: 2px solid var(--color-blue);
    font-size: var(--font-size);
    line-height: var(--line-height);
    outline: none;
    background: var(--color-black);
    box-shadow: var(--gf-ring-offset-shadow,0 0 #0000),var(--gf-ring-shadow,0 0 #0000),var(--button-shadow);
    padding: 12px 22px 14px 22px;
  }
  .button:hover {
    --button-shadow: var(--gf-action-shadow-hover);
  }
`

/** custom app element logic */
export const Form = isle(
  { tag: 'license-form' },
  base => class extends base {
    async plait({ feedback }: PlaitProps) {
    
      feedback({
        async submit(evt: FormDataEvent) {
          evt.preventDefault()
          const did = (evt.currentTarget as HTMLFormElement).elements['did'].value
          await fetch('http://localhost:9000/',  {
            method: 'POST',
            body: JSON.stringify({ did }),
            headers: {
              mode:'no-cors',
              'Content-Type': 'application/json',
            },
          })
        },
      })
    }
  }
)

export const FormTemplate: PlaitedElement = () => (
  <Form.template { ...stylesheet}>
    <form 
      data-target='license-gate'
      className={cls.form}
      data-trigger={{ submit: 'submit' }}
    >
      <label
        htmlFor='key'
        className={cls.label}
      >
          Please enter your did
      </label>
      <input
        name='did'
        type='text'
        placeholder='Your did'
        className={cls.input}
      />
      <button 
        type='submit'
        className={cls.button}
      >
          Submit
      </button>
    </form>
  </Form.template>
)
