# useMediaQuery

A lightweight React hook that provides responsive breakpoint detection and media query evaluation based on the current window width.

## ✨ Features

- Determine the current breakpoint index (xs, sm, md, lg, xl)
- Evaluate string, number, or object-based media query rules
- Fully customizable via context
- Optional live updates on window resize

## 🚀 Installation

Install the package and its peer dependencies:

```bash
npm install @ehsaneha/react-media-query
```

Or

```bash
yarn add @ehsaneha/react-media-query
```

---

## 🔧 Usage

### Basic Example

```tsx
import useMediaQuery, {
  MediaQueryProvider,
  BREAKPOINTS,
  MEDIA_QUERRY_RULES,
} from "./useMediaQuery";

function Component1() {
  const breakpoint = useMediaQuery(); // returns 0–5 based on window width
  return <p>Current breakpoint index: {breakpoint}</p>;
}

function Component2() {
  const isTabletOrLower = useMediaQuery({ md: true }); // returns boolean on window width
  return (
    <p>
      Window Size is now:
      {isTabletOrLower ? "Tablet Or Phone" : "Larger Than Tablet"}
    </p>
  );
}

function App() {
  return (
    <>
      <Component1 />
      <Component2 />
    </>
  );
}
```

### Using Rules

```tsx
const isTabletOrLower = useMediaQuery(MEDIA_QUERRY_RULES.MD); // true if width <= 'sm' breakpoint
const isExactlyTablet = useMediaQuery(MEDIA_QUERRY_RULES.EMD); // true if width === 'sm' breakpoint
const breakPointIndex = useMediaQuery({ sm: true, lg: true }); // closest matching index if width matches either
const isTabletOrLower = useMediaQuery(BREAKPOINTS.MD); // true if index <= 2 (e.g. md or below)
```

---

## 📡 useMediaQueryOnChange

A companion hook to trigger a callback whenever the viewport matches a new media query state.

```tsx
import { useMediaQueryOnChange } from "./useMediaQuery";

function App() {
  useMediaQueryOnChange((result) => {
    console.log("Breakpoint changed:", result);
  }, "md");

  return <div>Listening to breakpoint changes…</div>;
}
```

- Supports same rule types as useMediaQuery
- Callback result type is boolean or index (0–5)
- Debounced internally (default delay: 1000ms)

---

## 📐 Breakpoints

By default, the breakpoints used are:

| Key | Width (px) |
| --- | ---------- |
| xs  | 576        |
| sm  | 768        |
| md  | 992        |
| lg  | 1200       |
| xl  | 1700       |

You can override these via the MediaQueryProvider:

```tsx
<MediaQueryProvider sizes={{ sm: 700, md: 900 }}>
  <App />
</MediaQueryProvider>
```

## ⏱ Live Updates

useMediaQuery responds to window resize events and automatically updates its return value.

## 🧪 Testing

If testing in Jest, make sure to mock window\.innerWidth and debounce logic. Use jsdom for DOM environment simulation.

---

## License

This package is licensed under the MIT License. See LICENSE for more information.

---

Feel free to modify or contribute to this package!
