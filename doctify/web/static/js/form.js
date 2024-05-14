function reset_input_msg(div_id, msg_id){
    let container = document.querySelector(`#${div_id}`);
    let message = document.querySelector(`#${msg_id}`);

    container.className = ''
    message.remove();
}