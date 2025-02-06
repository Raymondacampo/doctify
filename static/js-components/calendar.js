import csrftoken from "../js-functions/cookie";
import {ToWeekList, CalendarHeader, DisabledForm, ClinicOptions} from "./calendarComponents";
import Equis from "./equis";
import { useClickOut } from "../js-functions/clickOut";
const {useEffect} = React;
const {useRef} = React;

const DoctorCalendar = ({onAction, onAlert, cal, setDate, y, m, loading, virtually, setVirtual, owner}) => {
    const timeListRefference = useRef();

    const [calendar, setCalendar] = React.useState({
        year: null,
        month: null,
        weekdays: null, 
        date_days: null
    })

    const [time, setTime] = React.useState({
        render: 'Select a time',
        value: null
    })

    const [selection, setSelection] = React.useState(false)
    const [dateSet, setDateSet] = React.useState(false)

    const [open, setOpen] = React.useState(true)
    const [openList, setOpenList] = React.useState()
    const [newDate, setNewDate] = React.useState()
    const [submit, setSubmit] = React.useState(false)

    useClickOut(timeListRefference, setOpenList, openList)

    useEffect(() => {
        setCalendarData(); 
    },[cal])

    useEffect(() => {
        
        let handler = () => {
            onAction(false)
            if (submit){
                setCalendarData();
                setSubmit(false)
            }
            return() =>  cal.removeEventListener('animationend', handler)
        }
        if (!open){
            const cal = document.querySelector('.close_calender')
            cal.addEventListener('animationend', handler)
            setOpenList(false)            
        }
    },[open])

    useEffect(() => {
        if(time.value){
            setNewDate(`${y}-${m + 1}-${selection.day}`)
        }
    },[time])

    const handeSelection = async (day) => {
        const cal = await fetch(`calendar?year=${y}&month=${m}&date_id=${day[0]}&day=${day[1]}&virtually=${virtually}`).then(response => response.json())
        if(cal.length > 1){
            setSelection(null)
            setDateSet(cal)
        }else{
            setDateSet(cal)  
            setSelection(cal[0])
        }
        
    }

    // Renders CALENDAR DAYS
    function setCalendarData(){
        setCalendar({
            year:cal.year,
            month: cal.month,
            weekdays: <ToWeekList dayNames={cal.day_names} calendar_days={cal.calendar_days} onAction={handeSelection} selected_day={dateSet}/>, 
            date_days: cal.cate_days
        })        
    }  

    const restartTime = () => {
        setTime({
            render: 'Select a time!',
            value: null,
            id:null
        })
    }
    // PREV OR NEXT MONTH
    function handleCalendar(action){
        try{
            setSelection(null)
            setDateSet(null)
            restartTime()
            if(action == 'prev'){
                if (m < 1){
                    setDate(y - 1, 11)
                }else{
                    setDate(y, m - 1 )
                }
            }else if (action == 'next'){
                if (m > 10){
                    setDate(y + 1, 0)
                }else{
                    setDate(y, m + 1 )
                }
            }            
        }finally{
            setCalendarData();
        }

    }

    // CREATE THE DATE
    async function makeDate() {
        let modality = ''
        virtually ? modality = 'virtually' : modality = 'in_person'
        const date_making = await fetch('calendar', {
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            body: JSON.stringify({date: newDate, time: time.value, date_set: time.id, modality: modality})
        }).then(response => response.json());
        setSubmit(true)
        setSelection(null)
        setOpen(false)
        onAlert({
            valid: date_making[0],
            msg: date_making[1],
        });
        setTimeout(() => {setDate(new Date().getFullYear(), new Date().getMonth())}, 500)
    }

    async function selectPatient() {
        let modality = ''
        virtually ? modality = 'virtually' : modality = 'in_person'
        const date_making = await fetch('/myaccount/select_patient_for_date', {
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            body: JSON.stringify({date: newDate, time: time.value, date_set: time.id, modality: modality})
        }).then(window.location.href = '/myaccount/select_patient_for_date')

    }

    useEffect(() => {
        restartTime()
    },[selection])
    
    return(
        <div className={open ? "calender_container open_calender" : "calender_container close_calender" }>
            <div className="calender_div">
                <div className="header" style={{justifyContent: 'space-between', marginBottom: '1rem'}}>
                <div style={{ display: "flex", border: '1px solid #ccc', borderRadius: '5px' }}>
                    <div className={virtually ? 'unselectedStyle' : 'selectedStyle'} onClick={() => setVirtual(false)}>In Person</div>
                    <div className={virtually ? 'selectedStyle' : 'unselectedStyle'} onClick={() => setVirtual(true)}>Virtually</div>
                </div>
                    <Equis onAction={setOpen} setFalse={true}/>                 
                </div>
                {loading ? 
                    <div className="loading_calender">Loading...</div>
                :
                    <>
                        <CalendarHeader year={y} month={m} yearName={calendar.year} monthName={calendar.month} onAction={handleCalendar}/>
                        <ToWeekList dayNames={cal.day_names} calendar_days={cal.calendar_days} onAction={handeSelection} selected_day={dateSet ? dateSet[0].day : undefined}/>
                        <ClinicOptions dateSet={dateSet} selection={selection} onAction={setSelection}/>

                        {selection && <>
                            <div className="hours_btn_div" ref={timeListRefference}>
                                <div className='hours_btn' onClick={() => setOpenList(true)}>
                                    <span>{time.render}</span>
                                    <i className="arrow down"></i>
                                </div>
                                {openList && 
                                <ul> {selection.hours_set.length < 2 || selection.hours_set[0].length > 1 ? selection.hours_set.map((hours, index) => 
                                    hours[1].length > 1 ? hours[1].map((h, index) => <li key={index}><button onClick={() => [setTime({render: h[1], value: h[0], id: hours[0]}), setOpenList(false)] }>{h[1]}</button></li>)
                                    :<li key={index}><button onClick={() => [setTime({render: hours[1][0][1], value: hours[1][0][0], id: hours[0]}), setOpenList(false)] }>{hours[1][0][1]}</button></li>
                                ) 
                                    :<li key={selection.hours_set[1][0][0]}><button onClick={() => [setTime({render: selection.hours_set[1][0][1], value: selection.hours_set[1][0][0], id: selection.hours_set[0]}), setOpenList(false)] }>{selection.hours_set[1][0][1]}</button></li>}
                                    
                                </ul>}
                                     
                            </div>
                            {time.value && <div className="confirm_date_creation">{!owner ? 
                                <><h3>Date for {newDate} at {time.render}</h3><button onClick={() => makeDate()}>Create date</button></>
                                :
                                <><h3>Date for {newDate} at {time.render}</h3><button onClick={() => selectPatient()}>Select Patient</button></>
                                }</div>}
                        </>}  
                <DisabledForm s={selection} d={dateSet} t={time.value}/>
                </>}
            </div>
        </div>
    )
}
export default DoctorCalendar;