import CancelDate from "../js-components/cancelDate";
import CustomAlert from "../js-components/customAlert";
const {useEffect} = React;
function App(){
    const [cancelDate, setCancel] = React.useState({
        id: null,
        str: null
    })
    const [alert, setAlert] = React.useState({
        valid: null,
        msg: null
    })

    const buttons = document.querySelectorAll("button[data-target]");
    useEffect(() => {

        if (localStorage.getItem("userData")) {
            const userData = JSON.parse(localStorage.getItem("userData"));
            setAlert({valid:userData.valid, msg: userData.msg}); // Render the alert component
            localStorage.removeItem("userData"); // Clear the flag
        }

        const handleClick = (event) => {
            const dataTarget = event.currentTarget.getAttribute("data-target");
            const [value1, value2] = dataTarget.split(",");
            setCancel({
                id: value1,
                str: value2
            })
        };

        buttons.forEach((button) => {
            button.addEventListener("click", handleClick);
        });

        // // // Cleanup event listeners on unmount
        return () => {
            buttons.forEach((button) => {
                button.removeEventListener("click", handleClick);
            })};
    }, [])
    const closeCancel =() => {
        setCancel(null)
    }

    useEffect(() => {
        if (alert.msg){
            setCancel(null)
            setTimeout(() => {setAlert(null)}, 1500);
        }            
    },[alert])

    const alertManagement = (valid, msg) => {
        const data = {
            valid: valid,
            msg: msg
        }
        localStorage.setItem("userData", JSON.stringify(data));
        location.reload()
    }

    return(
        <> 
            {cancelDate && <CancelDate id={cancelDate.id} str={cancelDate.str} onAction={closeCancel} setAlert={alertManagement}/>}
            {alert.msg && <CustomAlert valid={alert.valid} message={alert.msg}/>}
        </>
    )
};    

// Render the component into the desired container
const container = document.getElementById("your-react-root-id");

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App/>);
}

// function App(){
//     let [counter, setCounter] = React.useState(0)
//     const [cancelDate, setCancel] = React.useState({
//         id: null,
//         str: null
//     })



//     const updateCancel = (date_id, date_str) => {
//         console.log(date_id, date_str)
//         setCancel({
//             id: date_id,
//             str: date_str
//         })
//     }
//     const closeCancel =() => {
//         setCancel(null)

//     }

//     useEffect(() => {
//         try{
//             if (alert.msg){
//                 setCancel(null)
//                 setCounter((c) => c + 1)
//                 setTimeout(() => {autoClose()}, 5000);
//             }            
//         }finally{
//             console.log(counter)
//         }

//         function autoClose(){
//             setAlert({valid:null, msg: null})

//         }
//     },[alert])

//     return(
//         <> 
//             {cancelDate && <CancelDate id={cancelDate.id} str={cancelDate.str} onAction={closeCancel} setAlert={setAlert}/>}
//             {alert.msg && <CustomAlert valid={alert.valid} message={alert.msg}/>}
//         </>
//     )
// }

// const myDatesRoot = ReactDOM.createRoot(document.getElementById('mydates')); // Use createRoot
// myDatesRoot.render(<App />);
