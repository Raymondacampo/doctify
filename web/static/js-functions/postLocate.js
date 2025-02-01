import csrftoken from "./cookie.js";
document.addEventListener("DOMContentLoaded", () => {
    const inPersonCheckbox = document.getElementById("in_person");
    const virtuallyCheckbox = document.getElementById("virtually");

    // Single event handler for both checkboxes
    function handleCheckboxChange(event) {
    // Determine which checkbox fired the event
    const checkboxId = event.target.id;
    const isChecked = event.target.checked;

    // Build a data object keyed by the checkbox ID
    const data = {};
    data[checkboxId] = isChecked;
    console.log(event.target.name)
    fetch(`managespec?spec=${'locate'}`, {
        method: "POST",
        headers: {
        'X-CSRFTOKEN': csrftoken,
        },
        body: JSON.stringify(data),
    }).then(response => response.json()).then(
        location.reload());
    }

    // Attach the same event handler to both checkboxes
    inPersonCheckbox.addEventListener("change", handleCheckboxChange);
    virtuallyCheckbox.addEventListener("change", handleCheckboxChange);
    });
  