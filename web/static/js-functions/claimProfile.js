import csrftoken from "./cookie.js";

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('claim_button')
    button.addEventListener('click', handleClick)
})

const handleClick = async(event) => {
    const doc_id = event.currentTarget.getAttribute("data-target")
    const claim = await fetch(`/claim/${doc_id}`, {
        method: 'POST',
        headers: {
            'X-CSRFTOKEN': csrftoken,
        }
    }).then(response => response.json()).then(data => {
        localStorage.setItem("message", JSON.stringify(data));
        window.location.href = `/myaccount/doctor_profile`
    })
}
