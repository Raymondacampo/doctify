import { createRoot } from "react-dom/client";

const{ useRef, useEffect } = React;
import SpanMenu from "../js-components/SpanMenu";

document.addEventListener("DOMContentLoaded", () => {
  // Find all the .clickable-span elements
  const spans = document.querySelectorAll(".clickable-span");

  spans.forEach((span) => {
    // The ID is in data-target
    const itemId = span.getAttribute("data-target");
    // The matching container is #react-root-ID
    const containerId = `react-root-${itemId}`;
    const container = document.getElementById(containerId);

    if (container) {
      // Create a React root for this item
      const root = ReactDOM.createRoot(container);
      // Render the SpanMenu component, passing the itemId and the actual spanElement
      root.render(<SpanMenu itemId={itemId} spanElement={span} />);
    }
  });
});
