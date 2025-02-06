if(document.getElementById('description_loc')){
  const paragraph = document.getElementById('description_loc');
  const toggleBtn = document.getElementById('toggleBtn');

  // On page load, check if the paragraph exceeds 5 lines
  document.addEventListener('DOMContentLoaded', () => {
    // Get the computed line-height (in px) of the paragraph
    const lineHeight = parseFloat(window.getComputedStyle(paragraph).lineHeight);
    // Calculate the 5-line height limit
    const fiveLineHeight = lineHeight * 5;

    // Check the full scroll height (true content height) vs. 5-line limit
    if (paragraph.scrollHeight > fiveLineHeight) {
      // Reveal the See More button if text is longer than 5 lines
      toggleBtn.style.display = 'block';
    }
  });

  // Toggle paragraph clamp/expansion
  toggleBtn.addEventListener('click', () => {
    paragraph.classList.toggle('expanded');
    if (paragraph.classList.contains('expanded')) {
      toggleBtn.innerText = 'See Less';
    } else {
      toggleBtn.innerText = 'See More';
    }
  });

}
