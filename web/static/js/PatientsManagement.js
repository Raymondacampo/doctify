const {useEffect} = React;
import CreatePatientForm from "../js-components/createPatient";
import CustomAlert from "../js-components/customAlert";
import SearchBar from "../js-components/patientsSearchBar";
function AddPatient(){
    const [isOpen, setOpen] = React.useState(false)
    const [result, setResult] = React.useState({
        msg: '',
        valid: false
    })

    const handleResult = (msg, valid) => {
        setTimeout(() => {location.reload()}, 1500)
        setResult({msg: msg, valid: valid})
        setOpen(false)
    }

    useEffect(() => {
        if (result.msg){
            setTimeout(() => {autoClose()}, 4000);
        }
        function autoClose(){
            setResult({msg:null, valid:null})
        }
    }, [result])

    const goToPatient = (user_id) => {
        window.location.href = `/${user_id}/profile`
    }

    return (
        <>
            <SearchBar fetchUrl={'/myaccount/get_patients'} onSelect={goToPatient}/> 
            <div className="buttons_container" >
                <button className="add" style={{margin: 'auto'}} onClick={() => setOpen(true)}>Add Patient</button>   
                {/* <button className="rm" onClick={() => setOpen(true)}>Remove Patient</button>    */}
            </div>
            
            <CreatePatientForm isVisible={isOpen} onClose={() => setOpen(false)} onResult={handleResult}/>   
            
            {result.msg && result.valid && <CustomAlert valid={result.valid} message={result.msg}/>}
        </>
    )
}

// function RemovePatient(){
//     useEffect(() => {
//         console.log('adios')
//     },[])
//     return (
//         <button onClick={() => console.log('adios')}>Hola</button>
//     )
// }

const AddPatientRoot = ReactDOM.createRoot(document.getElementById('add_patient_container'))
AddPatientRoot.render(<AddPatient/>)

// const RemovePatientRoot = ReactDOM.createRoot(document.getElementById('remove_patient_container'))
// RemovePatientRoot.render(<RemovePatient/>)