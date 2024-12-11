import { mount, dom } from "@wallerbuilt/mycelia";

const { div, button, span } = dom;

export default function Counter(selector) {
  let count = 0;

  const incrementButton = button(
    { onclick: () => updateCount(++count) },
    "Increment"
  );

  const countDisplay = span({}, `Count: ${count}`);

  const updateCount = (newCount) => {
    countDisplay.textContent = `Count: ${newCount}`;
  };

  const component = div({ classname: "counter-container" }, [
    incrementButton,
    countDisplay,
  ]);

  if (selector) {
    document.addEventListener("DOMContentLoaded", () => {
      mount(component, selector);
    });
  }

  return component;
}
