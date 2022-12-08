# Recoil:Spring

![Recoil:Spring Logo](#gh-dark-mode-only)
![Recoil:Spring Logo](#gh-light-mode-only)

<p align="center">Jumpstart Recoil: less boilerplate, more code.</p>

<details>
    <summary>Contents</summary>

* [Intro](#intro)
* [Documentation](#documentation)
* [Installation](#installation)
* [Quick Start](#quickstart)
* [Acknowledgements](#acknowledgements)
</details>

## Intro


## Documentation

See docs site - 

## Quick Start

The best place to find details of the Recoil:Spring API is at the doc site mentioned above.
However, this section highlights the main concepts and usage.

### Spring

Two ways to initialize: Object-map or chained calls.

Both code examples below are identical in their outcome:

```javascript

```

```javascript

```


### Atom Family

One of Recoil's more useful yet cumbersome entities is the Atom Family. It's extremely useful for storing data over a collection.
Yet, Recoil doesn't provide a way to track the items within the collection. Their docs explain that a custom atom should be employed to do that.
Spring does this seamlessly when encountering a Family record.

### Selectors

### Simple Selector

Below is an example of the simplest read/write selector hook 

```javascript
import { createSelectorHook } from "recoil-spring";
import atoms from "../store";

const {
	borderColor
} = atoms;

const useCollageBorderColor = createSelectorHook(borderColor);

//recoil:spring will generate a selector key using the atom's key. 
//If you'd like to set your own key do the following:
const useCollageBorderColor = createSelectorHook("MyCustomBorderColorSelector", borderColor);

export default useCollageBorderColor;
```

```jsx
import useCollageBorderColor from "./store/selectors/useCollageBorderColor";

const MyComponent = () => {
  const [borderColor, setBorderColor] = useCollageBorderColor();
		
  return (
		<input 
          type="number"
          value={borderColor}
          onChange={(e) => setBorderColor(parseInt(e.target.value))}
        />
  );
};
```

#### Computed

Below is an example of a computed selector, combining two atoms into one result: 

```javascript
import { createSelectorHook } from "recoil-spring";
import atoms from "../store";

const {
	borderWidth,
	borderColor,
} = atoms;

const useCollageBorder = createSelectorHook(
	//need to provide a key for the selector since we use a custom getter
	"CollageBorderSelector",
	(get) => [get(borderColor), get(borderWidth)],
);

export default useCollageBorder;
```

Using the resulting readonly selector hook is done in the following way:

```jsx
import useCollageBorder from "./store/selectors/useCollageBorder";

const MyComponent = () => {
	const [color, width] = useCollageBorder();

	return (
		<div
			style={{ borderColor: color, borderWidth: `${width}px` }}>
			//...
		</div>
    );
};

```

#### Custom Setter

Below is a selector hook that reads one (atom) value but writes to two atoms.
Using it works exactly the same as any other read/write hook

```javascript
import { createSelectorHook } from "recoil-spring";
import atoms from "../store";

const {
	width,
	height,
} = atoms;

const useDimensions = createSelectorHook(
	width,
	(newVal, { set }) => {
		set(width, newVal);
		set(height, newVal);
	},
);

export default useDimensions;
```


## Acknowledgements

logo's spring thanks to: <a href="https://www.flaticon.com/free-icons/spring" title="spring icons">Spring icons created by Zaenul Yahya - Flaticon</a>



