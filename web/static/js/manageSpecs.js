const {useEffect} = React;
const {useRef} = React;
import SearchBar from "../js-components/searchBar";
import { manageSpec } from "../js-functions/postSearchVal";
import MySpecs from "../js-components/mySpecs";
import Equis from "../js-components/equis";
import { useClickOut } from "../js-functions/clickOut";
import { use } from "react";
function App(type){
    type = type.type;
    let [renderType, setRenderType] = React.useState({
        s: null,
        p: null
    });
    
    // open div state
    let [opened, setOpen] = React.useState();

    // list of my Specs
    let [mySpecs, setMySpecs] = React.useState();

    // list of Specs
    let [ShowSpec, setShowSpec] = React.useState();

    let addSpecRef = useRef();

    // selected speciality
    let[selected, setSelected] = React.useState()

    // DELETE METHOD
    let[deleteMode, setDeleteMode] = React.useState(false)

    useEffect(() => {
        if (type == 'speciality'){
            setRenderType({s: 'especialidad', p: 'especialidades'})
        }else if (type == 'ensurance'){
            setRenderType({s: 'seguro', p: 'seguros'})
        }else if (type == 'clinic'){
            setRenderType({s: 'clinica', p: 'clinicas'})
        }
        getMySpec();

        async function getMySpec() {
            const Spec = await fetch(`/get_spec?spec=${type}&for_search=${false}&my_spec=${true}`).then(response => response.json())
            setMySpecs(Spec)
        }

    }, [])

    useClickOut(addSpecRef, setShowSpec, ShowSpec)

    const specSelected = (spec) =>{
        setShowSpec(false)
        setSelected(spec)
    }

    function close(){
        setOpen(false)
        setDeleteMode(false)
        setSelected(false)
        setShowSpec(false)
    }

    return(
        <div>
            {opened ?
                <div className='manage_body'>
                    <div className='manage_container'>
                        <div className='close_div'><button><Equis onAction={close} setFalse={false}/></button></div>
                        <div className='manage_content'>

                        <div className='manage_search' ref={addSpecRef}>
                                <h3>Agregar {renderType.s}</h3>
                                <SearchBar spec={type} update={specSelected} forSearch={false} own={false}/>

                            </div>
                            <div className='add_cont'>
                                {selected && <div><h4>{renderType.p} seleccionado:</h4><span>{selected}</span></div> }
                                {selected ? <button type='button' onClick={() => manageSpec(type, selected, false)}>Agregar</button> : <button disabled={true}> Agregar</button>}
                            </div>   

                            {mySpecs && <MySpecs r={renderType.p} onAction={setDeleteMode} deleteMode={deleteMode} type={type} mySpecs={mySpecs} />}

                         
                        </div>
                    </div>
                </div>
                :
                    <button onClick={() => setOpen(true)} className="small">Manage {type}</button>
            }
            
        </div>
    )
}

function ScheduleApp(){
    let [opened, setOpen] = React.useState();
    let [schedule, setSchedule] = React.useState();

    function close(){
        setOpen(false)
    }

    useEffect(() => {
        getMySpec()

        async function getMySpec() {
            const Spec = await fetch(`/get_spec?spec=schedule&for_search=${false}&my_spec=${true}`).then(response => response.json())
            setSchedule(Spec)
        }
    }, [])

    return(
        <>
        {opened ?
            <div className='manage_body'>
                <div className='manage_container'>
                    <div className='close_div'><button><Equis onAction={close} setFalse={false}/></button></div>
                    <p>{schedule}</p>
                </div>
            </div>   
            :<button onClick={() => setOpen(true)} className="small">Edit schedule</button>     
        }
        </>

    )
}

const specialityRoot = ReactDOM.createRoot(document.getElementById('manage_specialities')); // Use createRoot
specialityRoot.render(<App type='speciality'/>);

const ensuranceRoot = ReactDOM.createRoot(document.getElementById('manage_ensurances')); // Use createRoot
ensuranceRoot.render(<App type='ensurance'/>);

if(document.getElementById('manage_clinics')){
    const clinicRoot = ReactDOM.createRoot(document.getElementById('manage_clinics')); // Use createRoot
    clinicRoot.render(<App type='clinic'/>);    
}

const scheduleRoot = ReactDOM.createRoot(document.getElementById('manage_schedule')); // Use createRoot
scheduleRoot.render(<ScheduleApp/>);