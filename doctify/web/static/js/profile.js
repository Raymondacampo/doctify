document.addEventListener('DOMContentLoaded', function(){
})

//close calendary div
function closeDate(){
    const date = document.querySelector('#dateDiv')
    document.querySelector('#day').innerHTML = ''
    document.querySelector('#sub_btn').style.display = 'none'
    date.className = 'hide'
    infodate = 'Select a date!'
}

// list of weekdays and months
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',]
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// setting the date info
const today = new Date()
let month = today.getMonth()
let year = today.getFullYear()
let lastDayMonth = new Date(year, month + 1, 0);
let firstDayMonth = new Date(year, month, 1);
let daysOn = []



function makeDate(doctor_id){
    fetch(`/dayson?doctor=${doctor_id}`).then(response => response.json()).then(data => {
        
        // HTML query selectors
        const botoncito = document.querySelector('#time')
        const month_html = document.querySelector('#month_html');
        const date = document.querySelector('#dateDiv');
        let dayslist = document.querySelector('#days');
        // making div visible 
        date.className = `date_container`;
        if(data == null){
            document.querySelector('#weekdays').innerHTML = 'Este doctor no hace citas';
        }else{
            // resets the calendary days
            dayslist.innerHTML = '';

            // renders the current month
            month_html.innerHTML = `<h1>${months[month]} ${year}</h1>`;

            let lidays = '';
            const omittedDays = getDayIndx(weekdays, firstDayMonth.toLocaleDateString('en', {weekday: 'long'}))
            let weekorder = 0

            // sets the days with available docdates
            for(let i = 0; i < data.length; i++){
                for(let j = 0; j < data[i].days.length; j++){
                    daysOn.push(data[i].days[j] - 1)
                }
            }

            // makes space for the days out of the month
            if (omittedDays === 0){
                weekorder--
            }else {
                for(let k = 0; k < omittedDays; k++){
                
                if(k>0){
                    weekorder++  
                    console.log(weekorder)
                }
                
                lidays+= `<li class='nodate'>0</li>`;
                }  
                }
            

                // sets the list of the calendar days with available and unavailable docdates 
                for(let k = 1; k <= lastDayMonth.getDate(); k++){
                    if(weekorder <= 5){
                        weekorder++
                    }else{
                        weekorder = 0
                    }
                    if(daysOn.includes(weekorder)){
                        let clin = data.find((d) => d.days.includes(weekorder + 1))
                        // let date = new Date(Date(year, month, k))
                        lidays+= `<li><button class="pickdate_button" onclick="datedate('${weekorder}', '${doctor_id}', '${clin.clinic}', '${new Date(Date.UTC(year, month, k))}', '${k}')"><h3>${k}</h3></button></li>`;
                    } else {
                        lidays+= `<li><button disabled class="ds_button"><h3>${k}</h3></button></li>`;
                    }
                }
                dayslist.innerHTML = lidays;
                   
                }})}
            
        
let infodate = 'Select the time!'

// displays the available timedates

dateSelected = '<h1>Select a time</h1>' 
function datedate(weekday, doc_id, clinic, day, daynum){
    const timeinfo = document.querySelector('#time')
    const dayinfo = document.querySelector('#day')
    document.querySelector('#sub_btn').style.display = 'none'

    dayinfo.innerHTML = `<h1> ${weekdays[weekday]} ${daynum}</h1><br><a href=""><div class="box_prof_clinic">${clinic}</div></a> `
    timeinfo.innerHTML = 'Select the time!'
    infodate = 'Select the time!'
    
    day = new Date(day)
    day = day.getTime()
    console.log(day)
    weekday = parseInt(weekday)

    fetch(`/dayson?doctor=${doc_id}`).then(response => response.json()).then(data => {
        fetch(`/docdates/${doc_id}`).then(response => response.json()).then(docdates => {


            let neededDates = docdates.filter((filtroDia) => {
                console.log
                if(filtroDia.date === parseInt(day + filtroDia.time)){
                    return filtroDia.date
                }
            })
            let takenDates = []

            for(let i = 0; i < neededDates.length; i++){
                takenDates.push(neededDates[i].date - day)
            }
            
            document.addEventListener('click', function(event) {
                event.stopPropagation()

                if(!timeinfo.contains(event.target)){
                    timeinfo.innerHTML = infodate
                    timeinfo.className = ''
                }else{
                    timeinfo.innerHTML = ''
                    timeinfo.className = 'space_sd'

                        for(let j = 0; j < data.length; j++){

                            if(data[j].days.includes(weekday + 1)){
                                if(takenDates){
                                    for(let i = 0; i < data[j].hours.length; i++){
                                        if(!takenDates.includes(data[j].hours[i])){
                                            timeinfo.innerHTML += `<button class="time_date_btn" onclick="settit('${parseInt(data[j].hours[i]) + parseInt(day)}', '${data[j].strhours[i]}', '${data[j].clinic}')">${data[j].strhours[i]}</button>`
                                        }}
                                } else {
                                    for(let i = 0; i < data[j].hours.length; i++){
                                        timeinfo.innerHTML += `<button class="time_date_btn" onclick="settit('${parseInt(data[j].hours[i]) + parseInt(day)}', '${data[j].strhours[i]}', '${data[j].clinic}')">${data[j].strhours[i]}</button>`
                                    }
                                    }
                                }  
                            }
                        }
                }) 
        })       
    }) 
}
    


function settit(time, str_time, clin, date){
    date = new Date((parseInt(time)))
    document.querySelector("input[name='date']").value = date.getTime()
    document.querySelector("input[name='clinic']").value = clin
    infodate = str_time
    document.querySelector('#time').innerHTML = infodate
    document.querySelector('#sub_btn').style.display = 'block'
    console.log(date)
}

// return quantity of ommitted days
function getDayIndx(weekdays, casilla){
    for(i = 0; i<=6; i++){
        if(weekdays[i] == casilla){
            return i 
        }
    }
}

// renders the month by clicking the arrows 
function changeMonth(what, doc_id){
    console.log(lastDayMonth)
    console.log(firstDayMonth)

    if(what == 'next'){
        if(month < 11){
          month++  
        }else{
            month = 0
            year++
        }
    }else{
        if(month < 1){
            month = 11
            year--
        }else{
          month--  
        }
    }
    lastDayMonth = new Date(year, month + 1, 0);
    firstDayMonth = new Date(year, month, 1);
    makeDate(doc_id);
}




function isClicked(arg){
    console.log(arg)
    // document.addEventListener('click', function(event) {
    //     if(!arg.contains(event.target)){
    //         return false
    //     }else{
    //         return true
    //     }   
    // })
}