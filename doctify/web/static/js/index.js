document.addEventListener('DOMContentLoaded', function(){
    document.querySelector(`#speciality_disp`).style.display = 'none';
    document.querySelector(`#ensurance_disp`).style.display = 'none';
    document.querySelector(`#clinic_disp`).style.display = 'none';
    displayFormat();
})

let s_speciality = 'Elegir especialidad';
let s_ensurance = 'Elegir seguro';
let s_clinic = 'Elegir centro';

function show(what){
    const list =  document.querySelector(`#${what}_disp`)
    list.style.display = 'block';
    const btn = document.querySelector(`#${what}_bt`)
    const txtbx = document.querySelector(`#${what}_tb`)
    btn.style.display = 'none';
    document.querySelectorAll(`#${what}_button`).forEach((button) => {
        button.style.display = 'block';
        
        button.addEventListener('mouseover', function(){
            button.style.background = 'rgb(212, 212, 212)';
        })
        button.addEventListener('mouseout', function(){
            button.style.background = 'white';
        })

        if ((button.innerHTML).toLowerCase().includes((btn.value).toLowerCase()) && btn.type == 'button'){
            button.style.background = 'rgb(234, 234, 234)';
            button.focus()
            txtbx.focus()
        }else{
            button.style.background = 'white';
            txtbx.focus()
        }
        
    })

    btn.value = '';
    txtbx.value = '';

    document.addEventListener('click', function(event) {
        event.stopPropagation()
        console.log(event)
        if(!txtbx.contains(event.target) && !list.contains(event.target) && !btn.contains(event.target)){
            list.style.display = 'none';
            btn.style.display = 'block';
            if (what == 'speciality'){
                btn.value = s_speciality
                txtbx.value = s_speciality
            }if (what == 'ensurance'){
                btn.value = s_ensurance
                txtbx.value = s_ensurance
            }if (what == 'clinic'){
                btn.value = s_clinic
                txtbx.value = s_clinic
            }
        } 
      });

}


function displayChoices(what){
    const element = document.querySelector(`#${what}_tb`)
    const list =  document.querySelector(`#list${what}`)

    document.querySelectorAll(`#${what}_button`).forEach((button) => {
            if (!(button.innerHTML).toLowerCase().includes(element.value)){
                button.style.display = 'none';
            } else {
                button.style.display = 'block';
            }
    })
}

let speciality ='speciality'
let clinic ='clinic'
let ensurance ='ensurance'

function displayDoc(event, id, val){
    const btn = document.querySelector(`#${event}_bt`)
    if(event =='speciality'){
        speciality = id
        s_speciality = val
        btn.value = s_speciality
    }else if (event=='ensurance'){
        ensurance = id
        s_ensurance = val
        btn.value = s_ensurance
    } else if( event=='clinic'){
        clinic = id
        s_clinic = val
        btn.value = s_clinic
    }
    displayFormat();

    btn.style.display = 'block';
    btn.className ="select_sb bt ni"
    document.querySelector(`#${event}_disp`).style.display = 'none';
}

function displayFormat(){
    fetch(`doctor?speco=${speciality}&enseco=${ensurance}&clineco=${clinic}`).then(response => response.json()).then(data =>{
        const doc_container = document.querySelector('#doctors_container')
        doc_container.innerHTML = '';
        for(let i = 0; i < data.length; i++){
            const newDiv = document.createElement('div');
            newDiv.className = 'doctor bx_s';
            let pse = data[i].speciality
            let pe = '';
            for(let s = 0; s < data[i].speciality.length; s++){
                pe += `${pse[i]}`
            }
            newDiv.innerHTML = `
                <div class="info">
                    <div class="prof_pic_cont">
                            <img class="prof_pic" src=${data[i].image}>
                    </div>
                    <div class="info_txt" >
                        <div class="span_name"><a href="/${data[i].id}/profile">${data[i].name}</a></div>
                        <div class="span_cont"><p class="spec_prof_txt">${data[i].speciality}</p></div>
                        <div class="span_cont"><p>${data[i].clinic}</p></div>
                     </div>
                    
                </div>
                <div>
                <a href="/${data[i].id}/profile"><button type="button">Profile</button></a>
                </div>`;  
            doc_container.appendChild(newDiv);
        }

    })
}