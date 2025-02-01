const ToWeekList = ({dayNames, calendar_days, onAction, selected_day}) => {
    return(
        <ul className="ppl">
            {/* MON TUE WED THU FRI SAT SUN */}
            {dayNames.map((d, index) => <li className="day_name" key={index}>{d}</li>)}

            {/* CALENDAR DAYS */}
            {calendar_days .map((date, index) => 
                date[0] ? 
                    <li className={selected_day && selected_day == date[1] ? "selected_day" : undefined } key={index}><button  onClick={() => onAction(date)}><span>{date[1]}</span></button></li> 
                : 
                date[1] == 0 ? <li key={index} className="none_list"></li>
                    :<li key={index} className="no_date"><span>{date[1]}</span></li> 
            )} 

        </ul>
    )
}

const CalendarHeader = ({year, month, yearName, monthName, onAction}) => {
    let refferenceYear = 0
    if(new Date().getMonth() + 3 > 12){
        refferenceYear = new Date().getMonth() + 3 - 12
    }else{
        refferenceYear = new Date().getMonth() + 3
    }

    return(
        <div className="calendar_header">
            {year == new Date().getFullYear() ? month != new Date().getMonth() ? <button onClick={() => onAction('prev')}><i className="arrow left"></i></button> : undefined : <button onClick={() => onAction('prev')}><i className="arrow left"></i></button>}
            <h1>{monthName} {yearName}</h1>  
            {!(month + 1 == refferenceYear) ? <button onClick={() => onAction('next')}><i className="arrow right"></i></button> : undefined}                      
        </div>
    )
}

const DisabledForm = ({s, d, t}) => {
    return(
        <>
            {!d && <div className='clinics'><button disabled={true}>No date selected</button></div>}
            {!d && 
            <div className='disabled_btn'>
                <span>No date selected</span>
                <i className="arrow down"></i>
            </div>
            }
            {d ?
            <div className="confirm_date_creation">
                {!s ? <h2>Select a clinic</h2> : !t && <h2>Select a time!</h2>}
            </div>     
            :       
            <div className="confirm_date_creation">
                <h2>Build your date!</h2>
            </div>     
            }
        </>
    )
}

const ClinicOptions = ({dateSet, selection, onAction}) => {
    return(
        <>
            {dateSet && 
                <div className="clinics">
                    {dateSet.length > 1 ? dateSet.map((d, index) => selection && selection == d ? <button className="selected_clinic" key={index} onClick={() => onAction(d)}>{d.clinic_name}</button> : <button key={index} onClick={() => onAction(d)}>{d.clinic_name}</button>)
                    : <button className="selected_clinic">{dateSet[0].clinic_name}</button>}
                </div>
            }
        </>
    )
}



export {ToWeekList, CalendarHeader, DisabledForm, ClinicOptions}