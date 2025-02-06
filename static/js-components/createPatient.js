import csrftoken from "../js-functions/cookie";
import CustomAlert from "./customAlert";
const{ useEffect, useRef } = React;
const CreatePatientForm = ({ isVisible, onClose, onSubmit, onResult }) => {
    const formRef = useRef(null);

    // State for the form inputs
    const [FirstName, setFirstName] = React.useState("")
    const [LastName, setLastName] = React.useState("")
    const [idValue, setIdValue] = React.useState(""); // Stores Dominican ID (unformatted)
    const [phoneValue, setPhoneValue] = React.useState("+1"); // Stores phone number with +1 prefix
    const [error, setError] = React.useState(false)
    const [formError, setFormError] = React.useState("")

 
    // Close the form if clicked outside
    useEffect(() => {
        function handleOutsideClick(e) {
        if (formRef.current && !formRef.current.contains(e.target)) {
            onClose();
        }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        };
        
    }, [onClose]);

    // Validation for Dominican ID format
    const handleIdChange = (e) => {
        const rawValue = e.target.value.replace(/-/g, ""); // Remove dashes
        if (/^\d{0,11}$/.test(rawValue)) {
        setIdValue(rawValue);
        }
    };

    const formatId = (rawValue) => {
        if (rawValue.length <= 3) return rawValue;
        if (rawValue.length <= 10) return `${rawValue.slice(0, 3)}-${rawValue.slice(3, 10)}`;
        return `${rawValue.slice(0, 3)}-${rawValue.slice(3, 10)}-${rawValue.slice(10, 11)}`;
    };

    // Validation for Dominican phone number
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (value.startsWith("+1") && /^\+1\d*$/.test(value)) {
        setPhoneValue(value);
        }
    };

    if (!isVisible) return null;

    const handleSubmit = async() => {
        if (!FirstName || !LastName){
            setError(true)
        }else{
            let national_id = ''
            let phone = ''
            if(idValue){national_id = idValue};
            if(phoneValue != '+1'){phone = phoneValue};
            const formData = {
                first_name: FirstName,
                last_name: LastName,
                national_id: national_id,
                phone: phone
            }
            const response = await fetch('/myaccount/create_patient', {
                method: 'POST',
                headers: {
                    'X-CSRFTOKEN': csrftoken,
                },
                body: JSON.stringify({formData}),
            }).then(response => response.json())

            console.log(response) 
            if(response.valid){
                onResult(response.message, response.valid)
            }else{
                setFormError(response.errors)
            }
        }
    }

    return (
        <div className="absolutly" ref={formRef} >
            <div className="cont">
                <h3>Create Patient</h3>
                <div className="form_container">
                    {/* Name Input */}
                    <div className="form_sec">
                        <div>
                            <label htmlFor="name">First Name:</label>
                            <input onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name" type="text" id="first_name" name="first_name" required/>  
                        </div>
                    {error && !FirstName && <span style={{color: 'red', fontSize: '12px'}}>Nombre requerido</span>}
                    </div>

                    <div className="form_sec">
                        <div>
                            <label htmlFor="name">Last Name:</label>
                            <input onChange={(e) => setLastName(e.target.value)} placeholder="Your last name" type="text" id="last_name" name="last_name" required/>                    
                        </div>
                    {error && !LastName && <span style={{color: 'red', fontSize: '12px'}}>Apellido requerido</span>}
                    </div>

                    {/* Dominican ID Input */}
                    <div className="form_sec">
                        <div>
                            <label htmlFor="dominican-id"> Dominican ID:</label>
                            <input type="text" id="dominican-id" name="dominican-id" placeholder="000-0000000-0" value={formatId(idValue)} onChange={handleIdChange} />
                        </div>
                    {formError.national_id && <span style={{color: 'red', fontSize: '12px'}}>{formError.national_id}</span>}
                    </div>

                    {/* Dominican Phone Input */}
                    <div className="form_sec">
                        <div >
                            <label htmlFor="phone" >Phone Number:</label>
                            <input type="text" maxLength='12' id="dominican-phone" name="dominican-phone" value={phoneValue} onChange={handlePhoneChange} />
                        </div>
                    {formError.phone && <span style={{color: 'red', fontSize: '12px'}}>{formError.phone}</span>}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", width: '90%', margin: '10px auto' }}>
                    <button className="cancel" type="button" onClick={onClose}>Cancel</button>
                    <button className="accept" onClick={() => handleSubmit()}>Create</button>
                    </div>
                    
                </div>                
            </div>

        </div>
    );
};

export default CreatePatientForm;
