import Equis from "../js-components/equis";
import TimePicker from "../js-functions/timePicker";
import SearchBar from "../js-components/searchBar";
import csrftoken from "../js-functions/cookie";
const { useEffect } = React;
function MyDynamicDiv({data, close}) {
        const [inPerson, setInPerson] = React.useState(false)
        const [virtually, setVirtually] = React.useState(false)

        // State for the clinic input
        const [clinic, setClinic] = React.useState("");

        // State for the 7 day-of-week checkboxes
        // We store them in an object keyed by weekday name, or you can use an array.
        const [days, setDays] = React.useState({
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
        });

        const [price, setPrice] = React.useState(0)

        const handleDayChange = (dayName) => {
            setDays((prev) => ({
            ...prev,
            [dayName]: !prev[dayName], // Invert the boolean
            }));
        };

        // State for the 3 text inputs
        const [startTime, setStartTime] = React.useState(false);
        const [endTime, setEndTime] = React.useState(false);
        const [minutes, setMinutes] = React.useState(false);

        // Error message display
        const [errorMessage, setErrorMessage] = React.useState("");

        useEffect(() => {
            if (data){
                console.log(data)
            }
            
        },[])
        
        // Helper function to check if at least one day is selected
        const isAnyDaySelected = () => {
            return Object.values(days).some((checked) => checked === true);
        };

        const isFormValid = () => {
            // 1. At least one of [inPerson, virtually] must be true
            if (!inPerson && !virtually) {
            setErrorMessage("Please check in-person or virtual.");
            return false;
            }
        
            // 2. If in_person is checked, 'clinic' must be filled
            if (inPerson && clinic.trim() === "") {
            setErrorMessage("If you checked in-person, please fill the clinic name.");
            return false;
            }
        
            // 3. All three text inputs [startTime, endTime, minutes] must be filled
            if (startTime == false && startTime != 0 || endTime == false && endTime != 0 || minutes == false) {
            setErrorMessage("Please fill start time, end time, and minutes.");
            return false;
            }
            // 4. At least one day among [monday..sunday] must be checked
            if (!isAnyDaySelected()) {
            setErrorMessage("Please select at least one day of the week.");
            return false;
            }
        
            // If all checks pass
            setErrorMessage("");
            return true;
        };

        const handleSubmit = (e) => {
            e.preventDefault(); // Prevent native form submission
        
            if (!isFormValid()) {
            // If invalid, do nothing else
            return;
            }
        
            // Otherwise, handle valid form
            // For demonstration, we'll just log the data
            const formData = {
            in_person: inPerson,
            virtually,
            clinic,
            days,
            startTime,
            endTime,
            minutes,
            price
            };
            console.log(formData)
            fetch(`create_schedule`, {
                method: 'POST',
                headers: {
                    'X-CSRFTOKEN': csrftoken,
                },
                body: JSON.stringify({formData}),
            })
            location.reload()

        
            // ...you could do a fetch POST here, or other logic...
        };

        const deleteContainer = () => {
            const d = document.getElementById('date-schedule-lc')
            d.remove()
        }
        return (
            <div className="manage_body">
                <div className='manage_container' style={{overflowY: 'scroll'}}>
                    <div className='close_div'><Equis onAction={close ? close : deleteContainer} setFalse={false} /></div>
                    <div className="manage_content" style={{height: '100%'}}>
                        {!data ? <h2>Crear calendario de citas.</h2>
                        : <h2>Editar calendario de citas.</h2>
                        }
                        
                        <form onSubmit={handleSubmit} method="post" action={data ? 'edit_schedule' : 'create_schedule'} style={{width: '90%', maxWidth: '600px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken}/>
                            <div className="form_content">
                                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
                                    <h3>Modalidad:</h3>
                                        <div className={inPerson ? 'selection checked-bor' : 'selection'}  onClick={() => {setInPerson(true), setVirtually(false)}}><input readOnly type="checkbox" name="in_person" checked={inPerson}></input> <span>In person</span></div>
                                        <div className={virtually ? 'selection checked-bor' : 'selection'}  onClick={() => {setInPerson(false), setVirtually(true)}}><input readOnly type="checkbox" name="virtually" checked={virtually}></input> <span>Virtually</span></div>                            
                                </div>
                                {inPerson && 
                                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                        <h3>Clinica:</h3>
                                        <SearchBar spec={'clinic'} forSearch={false} own={1} val={clinic} onAction={setClinic}/>
                                    </div>                        
                                }

                                <div style={{display: 'flex', gap: '1rem', flexDirection: 'column'}}>
                                    <h3>Horario:</h3>
                                    <div className="time-pickers-container">
                                        <div><h4 style={{fontWeight: '100'}}>From </h4><TimePicker name={'from_time'} type={'hour'} val={startTime} onAction={setStartTime}/><span>Enter the time your day starts</span> </div>
                                        <div><h4 style={{fontWeight: '100'}}>to </h4><TimePicker name={'to_time'} type={'hour'} val={endTime} onAction={setEndTime}/><span>Enter the time at which your day ends</span></div>
                                        <div><h4 style={{fontWeight: '100'}}>every </h4><TimePicker name={'minute'} type={'minute'} val={minutes} onAction={setMinutes}/><span>Define how long your appointments last</span></div>
                                        
                                    </div>
                                </div>

                                <div style={{display: 'flex', gap: '1rem', flexDirection: 'column', justifyContent: 'start'}}>
                                    <h3>Dias:</h3>
                                    <div style={{display: 'flex', gap: '0.5rem 1rem', flexWrap: 'wrap', fontSize: '14px'}}>
                                        {Object.keys(days).map((dayName) => (
                                        <div key={dayName} className={days[dayName] ? 'selection wd checked' : 'selection wd'}  onClick={() => handleDayChange(dayName)}><input readOnly type="checkbox"  checked={days[dayName]} name={dayName}></input> <span>{dayName.charAt(0).toUpperCase() + dayName.slice(1)}</span></div>
                                        ))}                             
                                    </div>

                                </div>
                                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                    <h3>Precio por consulta:</h3>
                                    <input id="domPeso" type="number" name="price" min="0" step="0.01" placeholder="0.00RD$" style={{height: '10px', width: '100px', padding: '0.5rem'}} onChange={(e) => setPrice(e.target.value)}/>
                                </div>

                                {errorMessage && (
                                    <p style={{ color: "red", marginTop: "1em" }}>{errorMessage}</p>
                                )}
                            
                                
                            </div><div className="add_cont">{data ? <button type="submit" >Editar cita</button> : <button type="submit" >Crear cita</button>}</div>
                        </form>
                    </div>

                </div>
            </div>
        );
}



document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("createDivBtn");
  if(button){
    button.addEventListener('click', () => {
        // 1. Create a container div in the DOM
        const container = document.createElement("div");
        container.id = 'date-schedule-lc'
        document.body.appendChild(container);

        // 2. Create a root and render a React component into it
        const root = ReactDOM.createRoot(container);
        root.render(<MyDynamicDiv />);        
    })    
  }


});

export default MyDynamicDiv