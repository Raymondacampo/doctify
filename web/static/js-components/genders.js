const {useEffect} = React;
import csrftoken from "../js-functions/cookie";

const GendersSelection = ({onAction}) => {

    let [genders, setGenders] = React.useState({
        male: false,
        female: false,
        both: false
    })

    useEffect(() => {
        setGenders({both:true})
    },[])

    function getGender(gen){
        fetch('/search',{
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            body: JSON.stringify({spec: ['gender', gen]})
        }).then(response => response.json()).then(() => {
           onAction() 
        })
    }

    return(
        <>
            <div>
                <input type="checkbox" id='both' checked={genders.both ?? false} onChange={() => [setGenders({...!genders, both:true}), getGender(null)]}></input>
                <label htmlFor='both'>both</label>
            </div>
            <div>
                <input type="checkbox" id='male' checked={genders.male ?? false} onChange={() => [setGenders({...!genders, male:true}), getGender('male')]}></input>
                <label htmlFor='male'>male</label>
            </div>
            <div>
                <input type="checkbox" id='female' checked={genders.female ?? false} onChange={() => [setGenders({...!genders, female:true}), getGender('female')]}></input>
                <label htmlFor='female'>female</label>
            </div>
        </>
    )
}

export default GendersSelection;