const {useEffect} = React;
import csrftoken from "../js-functions/cookie";

const TakeDateSelection = ({onAction}) => {

    let [takeDate, setTakeDate] = React.useState()

    let [dateType, setDateType] = React.useState({
        inPerson: false,
        virtually: false
    })

    useEffect(() => {
        setTakeDate(false)
    },[])

    useEffect(() => {
        if(!takeDate){
            setDateType(!dateType)
        }
    },[takeDate])


    function getGender(spec, gen){
        console.log(gen)
        fetch('/search',{
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            body: JSON.stringify({spec: [spec, gen]})
        }).then(response => response.json()).then(() => {
           onAction() 
        })
    }

    return(
        <>
            <div>
                <input type="checkbox" id='takeDate' checked={takeDate ?? false} onChange={() => [setTakeDate(!takeDate), getGender('takedate', !takeDate? !takeDate : false)]}></input>
                <label htmlFor='both'>Aceptando citas</label>
            </div>
            {takeDate ?
            <>
                <div>
                    <input type="checkbox" id='inPerson' checked={dateType.inPerson ?? false} onChange={() => [setDateType({...!dateType, inPerson:!dateType.inPerson}), getGender('datetype', !dateType.inPerson ? 'in_person': null)]}></input>
                    <label htmlFor='inPerson'>Presencial</label>
                </div>
                <div>
                    <input type="checkbox" id='virtually' checked={dateType.virtually ?? false} onChange={() => [setDateType({...!dateType, virtually:!dateType.virtually}), getGender('datetype', !dateType.virtually ? 'virtually' : null)]}></input>
                    <label htmlFor='female'>Virtual</label>
                </div>   
            </>         
            :
            <>
                <div className="disabled_checkbox">
                    <input type="checkbox" id='inPerson'></input>
                    <label htmlFor='inPerson'>Presencial</label>
                </div>
                <div className="disabled_checkbox">
                    <input type="checkbox" id='virtually' ></input>
                    <label htmlFor='virtually'>Virtual</label>
                </div>   
            </>
            }

        </>
    )
}

export default TakeDateSelection;