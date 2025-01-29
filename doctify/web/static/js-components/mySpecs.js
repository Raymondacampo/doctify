import csrftoken from "../js-functions/cookie"
const MySpecs = ({r, deleteMode, onAction, type, mySpecs}) => {
    const deleteSpecurance = (spec) => {
        fetch(`managespec?spec=${type}`, {
            method: 'POST',
            headers: {
                'X-CSRFTOKEN': csrftoken,
            },
            body: JSON.stringify({ spec: spec, delete:true }),
          })
          location.reload()
    }

    return (
        <div className='my_manage'>
            <div className='manage_title'>
                <h3>Mis {r}</h3>
                {deleteMode != false ? <button onClick={() => onAction(false)}>Cancelar</button> : <button onClick={() => onAction(true)}>Eliminar</button>}
            </div>
            
                {deleteMode ?
                    <ul>
                        {type == 'ensurance' ? 
                            mySpecs.map((e, index) => <li key={index} onClick={() => deleteSpecurance(e[0])} className='delete'>{e[1] && <img src={e[1]}></img>}<span>{e[0]}</span><div className='delbtndes'><div></div></div></li>)
                        :
                            mySpecs.map((e, index) => <li key={index} onClick={() => deleteSpecurance(e)} className='delete'><span>{e}</span><div className='delbtndes'><div></div></div></li>)
                        }       
                    </ul>
                :
                    <ul>
                        {type == 'ensurance' ? 
                            mySpecs.map((e, index) => <li key={index}>{e[1] && <img src={e[1]}></img>}{e[0]}</li>)
                        :
                            mySpecs.map((e, index) => <li key={index}>{e}</li>)
                        }   
                        
                    </ul>
                }

        </div>    
    )
}

export default MySpecs;