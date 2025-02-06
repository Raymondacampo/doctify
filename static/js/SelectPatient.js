import SearchBar from "../js-components/patientsSearchBar";
import csrftoken from "../js-functions/cookie";
import CreatePatientForm from "../js-components/createPatient";
import CustomAlert from "../js-components/customAlert";
const { useEffect } = React;
const App = () => {
    const [patient, setPatient] = React.useState([])
    const [showAdd, setShowAdd] = React.useState(false)
    const [result, setResult] = React.useState({
        msg: '',
        valid: false
    })
    const [patients, setPatients] = React.useState([])

    useEffect(() => {
        const fetchOptions = async () => {
          try {
            const response = await fetch('/myaccount/get_patients');
            if (!response.ok) throw new Error("Failed to fetch options");
            const data = await response.json();
            setPatients(data); // Store the full list
            console.log(data)
          } catch (error) {
            console.error("Error fetching options:", error);
          }
        };
    
        fetchOptions();
      }, [result]);
    

    const handleResult = (msg, valid) => {
        setResult({
            msg: msg,
            valid: valid
        })
        setShowAdd(false)
        setTimeout(() => {window.location.href = `/myaccount/dates`}, 1500)
    }

    const asingClient = async() => {    
        console.log(patient[0], patient[1])
        const date_making = await fetch('calendar', {
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            body: JSON.stringify({patient_id: patient[0], type: patient[1]})
        }).then(response => response.json()).then(data => {handleResult(data[1], data[0]),  console.log(data[0], data[1])})
    }
    return (
        <div className="date_container">
            <div style={{position: 'relative', display: 'flex', width: '100%', justifyContent: 'center'}}>
                <h2 style={{ marginBottom: "20px", textAlign: 'center' }}>Select Patient</h2>
                <button style={{position: 'absolute', right: '0px', top: '5px', fontSize: '14px', color: 'blue'}} onClick={() => setShowAdd(true)}>Add Patient+</button>                    
            </div>

            <div className="sb_div">
                <SearchBar fetchUrl={'/myaccount/get_patients'} onSelect={setPatient}/>
            </div>

            <div className="patients_container">
                {patients.map((p, index) => <div onClick={() => setPatient([p.id, p.type, p.name])} key={index}>{p.name}</div>)}
            </div>

            <div className="submit_div">
                {patient && <h2>{patient[2]}</h2>}
                {patient[0] ? <button onClick={() => asingClient()}>Select</button>
                :<button className="disabled">Select</button> }               
            </div>


            {result.msg && <CustomAlert valid={result.valid} message={result.msg}/>}
            <CreatePatientForm isVisible={showAdd} onClose={() => setShowAdd(false)} onResult={handleResult}/>
        </div>
    );
};

// Render to the specific container
const container = document.getElementById("select_patient_container");

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
