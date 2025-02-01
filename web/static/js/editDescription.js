 const {useEffect} = React;
import csrftoken from "../js-functions/cookie";
import Equis from "../js-components/equis";
function App(){
 
    let [open, setOpen] = React.useState()
    let [description, setDescription] = React.useState()

    useEffect(() => {
        getDescription();

        async function getDescription() {
            const desc = await fetch('description').then(response => response.json())
            setDescription(desc)
        }
    }, [])

    function submit(){
        let val = document.querySelector('#description_cont')
        fetch('description', {
            method: 'POST',
            headers:{
                'X-CSRFTOKEN': csrftoken
            },
            body: JSON.stringify({ body: val.value})
        })
        location.reload()
    }

    return(
        <div>
            {open ?
                <div className='manage_body'>
                    <div className='manage_container'>
                        <div className='close_div'>
                            <button><Equis onAction={setOpen} setFalse={true}/></button>
                        </div>

                        <div className='manage_content'>
                            <h3>Modifica tu descripcion</h3>
                            <textarea id='description_cont'>{description}</textarea>
                            <div className='add_cont'>
                                <button onClick={() => submit()}>Modificar</button>
                            </div>
                        </div>
                    </div>
                </div>
            :
                <button onClick={() => setOpen(true)} className="small">Edit description</button>
            }
        
        </div>   
    )
}

const descriptionRoot = ReactDOM.createRoot(document.getElementById('edit_description')); // Use createRoot
descriptionRoot.render(<App/>);