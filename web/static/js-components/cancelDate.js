import csrftoken from "../js-functions/cookie"
import Equis from "./equis"

const CancelDate = ({id, str, onAction, setAlert}) => {

    function cancel(id){
        fetch(`canceldate/${id}`, {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken}
        }).then(response => response.json()).then(data => {
            setAlert(data[0],data[1])
        })
    }

    const closeCancel = () => {
        onAction()
    }

    return(
        <>
            {(id && str) &&
                <div className='absolutly'>
                    <div className='cont' style={{gap: '1rem'}}>
                        {/* <div className='close_div'>
                            <Equis onAction={closeCancel} setFalse={false}/>
                        </div> */}
                        <div>
                            <h3>
                                {str}  
                            </h3> 
                        </div>
                        <div style={{display: 'flex',width: '90%',margin: 'auto', justifyContent: 'space-between'}}>
                            <button className='cancel' onClick={() => closeCancel()}>Cancel</button>  
                            <button className='accept' onClick={() => cancel(id)}>Confirm</button>    
                        </div>
                        
                    </div>
                </div>
            }        
        </>
    )
}

export default CancelDate;