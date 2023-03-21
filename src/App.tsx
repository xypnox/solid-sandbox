import { Component, createMemo, createSignal, For } from 'solid-js';
import { createStore } from 'solid-js/store';

interface SingleTheme {
  text: { color: string }
  elements: {
    heading: { color: string }
    paragraph: { color: string }
  }
}

type ThemeMode = 'light' | 'dark'

interface ThemeStore {
  modes: Record<ThemeMode, SingleTheme>
}

const keys = [
  ['text', 'color'],
  ['elements', 'heading', 'color'],
  ['elements', 'paragraph', 'color'],
] as const

const [store, setStore] = createStore<ThemeStore>({
  modes: {
    light: {
      text: { color: '#000000' },
      elements: {
        heading: { color: '#000000' },
        paragraph: { color: '#000000' },
      },
    },
    dark: {
      text: { color: '#FFFFFF' },
      elements: {
        heading: { color: '#FFFFFF' },
        paragraph: { color: '#FFFFFF' },
      },
    },
  },
})

const [mode, setMode] = createSignal<ThemeMode>('dark')

const BrokenApp: Component = () => {
  return (
    <div class="App"  style={{
      "--background-color": mode() === 'dark' ? 'black' : 'white',
      // A map over the keys
      ...keys.reduce((acc, key) => {
        acc[`--${key.join('-')}`] = 'BROKEN' // How to get value from the key
        return acc
      }, {} as Record<string, string>)
    }}>
      <h1>Happy State incomplete</h1>
      <p>Change the theme mode and the colors of the text, heading and paragraph.</p>
      Some normal plain text
      <h2>Heading</h2>
      <p>Some paragraph text</p>

      <br />
      <hr />

      <For each={keys}>
        {([...path]) => (
          <div>
            <label>{path.join('.')}</label>
            <input
              type="color"
              value={/* How to get the value from keys here? */ "black"}
              onChange={(e: any) => {
                /* How to set the value from the keys here? */
                setStore('modes', mode(), keys as any, e.target?.value as string) 
              }}
            />
            </div>
        )}
      </For>

    </div>
  );
};

const ClunkyApp: Component = () => {

  // Ugly middleware hard to maintain
  const colors = createMemo(() => ([
    {
      label: 'Text Color',
      value: store.modes[mode()].text.color,
      onChange: (e: any) => setStore('modes', mode(), 'text', 'color', e.target?.value as string)
    },
    {
      label: 'Heading Color',
      value: store.modes[mode()].elements.heading.color,
      onChange: (e: any) => setStore('modes', mode(), 'elements', 'heading', 'color', e.target?.value as string)
    },
    {
      label: 'Paragraph Color',
      value: store.modes[mode()].elements.paragraph.color,
      onChange: (e: any) => setStore('modes', mode(), 'elements', 'paragraph', 'color', e.target?.value as string)
    }
  ]))

  return (
    <div class="App" style={{
      "--background-color": mode() === 'dark' ? 'black' : 'white',
      // Can the accessors be generic to get text color from just the keys?
      // So that this object is just a map over the keys?
      "--text-color": store.modes[mode()].text.color,
      "--heading-color": store.modes[mode()].elements.heading.color,
      "--paragraph-color": store.modes[mode()].elements.paragraph.color,
    }}>
      <h1>Clunky Version</h1>
      <p>Change the theme mode and the colors of the text, heading and paragraph.</p>
      Some normal plain text
      <h2>Heading</h2>
      <p>Some paragraph text</p>

      <br />
      <hr />

      <For each={colors()}>
        {(color) => (
          <div>
            <label>{color.label}</label>
            <input
              type="color"
              value={color.value}
              onChange={color.onChange}
            />
            </div>
        )}
      </For>

    </div>
  );
};

const styles = `
.App {
  height: 50vh;
  width: 50vw;
  display: flex;
  padding: 2rem;
  flex-direction: column;
  margin: auto;
  color: var(--text-color);
  background: var(--background-color);
}

.App hr {
  width: 100%;
  margin: 2rem 0;
}

.App h1 {
  font-size: 2rem;
}

.App h1, h2, h3, h4, h5, h6 {
  margin: 2rem 0 0.25rem;
  color: var(--heading-color);
}


.App p {
  font-size: 1rem;
  color: var(--paragraph-color);
}
`

const App: Component = () => {
  const [isBroken, setIsBroken] = createSignal(false)

  return (
    <div>
      <style>{styles}</style>
      <br />
      <p> Toggle Mode</p>
      <select value={mode()} onChange={(e: any) => setMode(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <hr />
      <button onClick={() => setIsBroken(!isBroken())}>Toggle Version</button>
      <h1>Version: {isBroken() ? 'Broken but with happy path in code' : 'Clunky version'}</h1>
      {isBroken() ? <BrokenApp /> : <ClunkyApp />}
    </div>
  )
}

export default App;
