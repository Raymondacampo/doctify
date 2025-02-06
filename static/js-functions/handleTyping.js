function handleTyping(val, state, list){
    let search = []
    for (let i = 0; i < list.length; i++){
        if(typeof list[i] != 'object'){
            if(list[i].toLowerCase().includes(val.toLowerCase())){
                search.push(list[i])
            }        
        }else{
            if(list[i][0].toLowerCase().includes(val.toLowerCase())){
                search.push(list[i])
            }    
        }

    }
    if (search.length < 1){
        search.push(['No results', undefined])   
    }

    state(search)
}

export default handleTyping