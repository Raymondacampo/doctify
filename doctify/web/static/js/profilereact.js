const {useEffect} = React;
const {useRef} = React; 
// list of weekdays and months
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',]
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// setting the date info
const today = new Date()

function App(){

    const [showDates, setShowDates] = React.useState(false)

    let [dates, setDates] = React.useState({
        year: today.getFullYear(),
        month: today.getMonth(),
        daysOn: []
    })

    const [choosed, setChoosed] = React.useState(false)
    const [makeTheDate, setMakeDate] = React.useState(false)

    let [dateInfo, setDateInfo] = React.useState({
        date: 'Elige una fecha',
        clinic: null,
        day: null,
        clinicRender: <div></div>,
        timeList: false,
        time: 'Selecte the time!'
    })

    let [dateMessage, setDateMessage] = React.useState({
        success: false,
        message: null,
        date: null,
        time: null
    })

    let firstDayMonth = new Date(dates.year, dates.month, 1);
    let lastDayMonth = new Date(dates.year, dates.month + 1, 0);
    let omittedDays = getDayIndx(weekdays, firstDayMonth.toLocaleDateString('en', {weekday: 'long'}))
    let daylist = setDayList()
    let daysOn =  []
    const showMoreBtn = document.getElementById('show_more_btn')
    const description = document.getElementById('doc_description')

    useEffect(() => {
        setDaysOn();
        let handler = () => {
            description.classList.remove('short_description');
            document.querySelector('.cover_description').remove();
            return () => removeEventListener('click', handler)
        }
        if(showMoreBtn){
            showMoreBtn.addEventListener('click', handler)            
        }


    }, []);

    async function setDaysOn(){
    let result = await fetch('/dayson').then(response => response.json())
    setDates({
        ...dates,
        daysOn: result[0]['days']
    })
    }

    // SET DAYLIST
    function setDayList(){
        let list = [] 
        let don = dates.daysOn
        let weekorder = 0
        
        for(let i = 0; i < omittedDays; i++){
            list.push([0, 'nodate'])
            weekorder++
        }        
        for(let i = 1; i <= lastDayMonth.getDate(); i++){


            if(don.includes(weekorder)){
                list.push([i, 'date'])
                
            }else{
                list.push([i, 'nidate'])
            }

            if(weekorder < 6){
                weekorder++
            }else{
                weekorder = 0
            }
                
            
        }

        return list
    }

    // return quantity of ommitted days
    function getDayIndx(weekdays, casilla){
        for(let i = 0; i<=6; i++){
            if(weekdays[i] == casilla){
                return i 
            }
        }
    }

    // toggle showDates
    function openDateSelection(){
        let theRest = document.querySelector('#sec2')
        setShowDates(!showDates)
        if(!showDates){
            theRest.className = 'hide'
        }else{
            theRest.className = 'prof_sec_2'
        }
    }

    // DIV with the CALENDAR
    function DatesElement(){

        // Restarts Dates information
        function restartDateInfo(){
            setDateInfo({
                date: <h1>Elige una fecha</h1>,
                clinic: null,
                day: null,
                clinicRender: false,
                timeList: false,
                time: 'Selecte the time!'
            })
            setChoosed(false)
            setDates({
                ...dates,
                year: today.getFullYear(),
                month: today.getMonth(),           
            })
            setDateMessage({
                success: false,
                message: null,
                date: null,
                time: null
            })
            setMakeDate(false)
            console.log(makeTheDate)
        }

        // changes month value
        function changeMonth(arg){
                if(arg == 'next'){
                    if(dates.month < 11){
                        setDates({
                            ...dates,
                            month: dates.month + 1
                        })              
                        firstDayMonth = new Date(dates.year, dates.month + 1, 1);
                        lastDayMonth = new Date(dates.year, dates.month + 2, 0);      
                    }else{
                        setDates({
                            ...dates,
                            year: dates.year + 1,
                            month: 0
                        })    
                        firstDayMonth = new Date(dates.year + 1, 0, 1);
                        lastDayMonth = new Date(dates.year + 1, 1, 0);       
                    }

                }else{
                    if(dates.month < 1){
                        setDates({
                            ...dates,
                            month: 11,
                            year: dates.year - 1
                        })           
                        firstDayMonth = new Date(dates.year -1, 11, 1);
                        lastDayMonth = new Date(dates.year - 1, 12, 0);        
                    }else{
                        setDates({
                            ...dates,
                            month: dates.month - 1
                        })  
                        firstDayMonth = new Date(dates.year, dates.month - 1, 1);
                        lastDayMonth = new Date(dates.year, dates.month, 0);    
                    }

                        }  
                console.log(firstDayMonth, lastDayMonth, daysOn[0])
        }

        // WORKS WITH THE SELECTED DATE
        async function selectedDate(d){
            let date = new Date(`${months[dates.month]} ${d}, ${dates.year}`).toISOString().split('T')[0]
            let data = await fetch(`/daySchedule?date=${date}`).then(response => response.json())
            let Changed = () => {if(dateInfo.day != d){console.log('cambio'); return true }else{console.log('no cambio');return false}}
            let hasChanged = Changed()
            console.log(hasChanged)
            setDateInfo({
                ...dateInfo,
                date: `${months[dates.month]} ${d}, ${dates.year}`,
                clinic: data[0],
                day: d,
                clinicRender: <div className='dateInfoCenter'>
                    <h3>Place: {data[0]}</h3>
                </div>,
                timeList: data[1],
                time: hasChanged ? 'Select the time!' : dateInfo.time
            })
            setMakeDate(hasChanged ? false : true)
        }

        // WORKS WITH THE SELECTED TIME
        function selectedTime(t){
            setDateInfo({
                ...dateInfo,
                time: t
            })
            setChoosed(false)
            setMakeDate(true)
        }

        // DETECTS CLICK OUT OF THE LIST AND CLOSES IT
        let btnref = useRef()
        useEffect(() => {
            let handler = async(e) => {
                if(!btnref.current.contains(e.target)){ 
                    selectedTime(dateInfo.time)
                }
                return() => {
                        document.removeEventListener('mousedown', handler)
                    }                
            };
            document.addEventListener('mousedown', handler)
            
        } )

        // MAKE DATE FUNCTION
        async function makeDate(){
            let date = new Date(dateInfo.date).toISOString().split('T')[0]
            const dateData = await fetch(`/makeDate?date=${date}&time=${dateInfo.time}&clinic=${dateInfo.clinic}`).then(response => response.json())
            console.log(dateData)
            setDateMessage({
                success: dateData[0],
                message: dateData[1],
                date: dateData[2],
                time: dateData[3]
            })
        }
        


        return(
            <div>
                {dateMessage.success ? 
                    <div className='messageCont'>
                        <div className='closeBtn'><button className='buttonBlue' onClick={() => [openDateSelection(), restartDateInfo()]}>X</button></div>
                        <div className='messageDiv'>
                            <div className='successMessage'>{dateMessage.message}</div>
                            <div className='successDate'><div><span className='title'>Date:</span> <span className='content'>{dateMessage.date}</span></div></div>
                            <div className='successDate'><div><span className='title'>Time:</span> <span className='content'>{dateMessage.time}</span></div></div>                            
                        </div>

                    </div> 
                    : 
                    <div className='dates_div'>
                    <div className='closeBtn'><button className='buttonBlue' onClick={() => [openDateSelection(), restartDateInfo()]}>X</button></div>
                    <div className='calendar_header'>
                        <div>
                            <h1>{months[dates.month]} {dates.year}</h1>
                        </div>
                        <div>
                            <button onClick={() =>changeMonth('prev')}><p><i className="arrow left"></i></p></button>
                            <button onClick={() =>changeMonth('next')}><p><i className="arrow right"></i></p></button>                  
                        </div>
    
                    </div>
                    <div className='calendar'>
                        <ul>
                            <li><p>SUN</p></li>
                            <li><p>MON</p></li>
                            <li><p>TUE</p></li>
                            <li><p>WED</p></li>
                            <li><p>THU</p></li>
                            <li><p>FRI</p></li>
                            <li><p>SAT</p></li>
                        </ul>
                        <ul>
                            {daylist.map((d) => <li><button onClick={() => selectedDate(d[0])} className={d[1]}>{d[0]}</button></li>)}
                        </ul>
                        <div className='dateInfo'>
                            <div className='dateInfoCenter'><h2>{dateInfo.date}</h2></div>
                            <div className={dateInfo.clinicRender ? 'e' : 'hide'}>{dateInfo.clinicRender}</div>
    
                            {dateInfo.timeList && (
                            <div className='timesDiv'>
                                { choosed ? 
                                <div className='dateInfoCenter'>
                                    <div ref={btnref} className='timesList'>{dateInfo.timeList.map((t) => <button onClick ={() => selectedTime(t)}>{t}</button>)}</div> 
                                </div>
                                : 
                                <div className='dateInfoCenter'><button className='timeSelection' onClick ={() => setChoosed(true)}>{dateInfo.time}</button></div>}
                            </div>
                            )}
                            {makeTheDate && (
                                <div className='dateInfoCenter'><button className='buttonBlue' onClick={() => makeDate()}>Make the date!</button></div>  
                            )}
                            
    
    
                        </div>
                    </div>
    
                    </div>
                }
            </div>
        )
    }


    return(
        <div className='makedatebtn'>
            <button className='buttonBlue' onClick={() => openDateSelection()}>Hacer cita</button>
            <div className={showDates ? 'date_container' : 'hide'}><DatesElement/></div>
        </div>
    )
}
ReactDOM.render(<App/>, document.querySelector('#date_btn_cont'))