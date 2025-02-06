
import csrftoken from "./cookie"
const valueSearch = (s, spec, update, arg) => {
    fetch(`/search`,
        {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            body: JSON.stringify({spec: [spec, s]})
        }).then(response => response.json()).then(data => {
            update && arg ? update(arg)
            : update && update(s)
        })
}

const manageSpec = (type, selected, deleteVal) => {
    fetch(`managespec?spec=${type}`, {
        method: 'POST',
        headers: {
            'X-CSRFTOKEN': csrftoken,
        },
        body: JSON.stringify({ spec: selected, delete:deleteVal }),
      })
    location.reload()
    }

export {valueSearch, manageSpec};