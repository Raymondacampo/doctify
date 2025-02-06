import CustomAlert from "../js-components/customAlert";
const {useEffect} = React;
function App(){
    const [message, setMessage] = React.useState({
        valid:null, 
        msg: null
    })
    useEffect(() => {
        const result = JSON.parse(localStorage.getItem("message"));
        setMessage({
            valid: result.valid, 
            msg: result.message
        })
        localStorage.removeItem("message");
    },[])

    useEffect(() => {
        setTimeout(() => {setMessage(null)}, 5000)
    },[message])

    if(!message){
        return null
    }

    return(
        <CustomAlert valid={message.valid} message={message.msg}/>
    )
}

const messageRoute = ReactDOM.createRoot(document.getElementById('message_container'));
messageRoute.render(<App/>);