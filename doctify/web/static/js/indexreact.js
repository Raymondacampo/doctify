const {useEffect} = React;  
const {useRef} = React;  

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};
let csrftoken = getCookie('csrftoken')
function App(){
    // CREATES EACH ONE OF THE SEARCHBARS 
    function SearchBars(type){
        let divRef = useRef();
        let listRef = useRef();

        let [searchStarted, setSearchStarted] = React.useState(false)
        let [sbValue, setSbValue] = React.useState(type.name)
        let [tempValue, setTemp] = React.useState(type.name)

        let [submitValues, setSubmitValues] = React.useState({
            speciality: null,
            city: null
        })

        let [list, setList] = React.useState({
            temporary: [],
            permanent: []
        })

        // get UserLocation
        function getLocation() {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(success)
            } else { 
              let locationMessage = "Geolocation is not supported by this browser.";
            }
          }
        //   RUNS WHEN USER LOCATION
        async function success(position){
            const currentCity = await fetch(`locateUser?lat=${position.coords.latitude}&lon=${position.coords.longitude}`).then(response => response.json());
            setSbValue(currentCity)
            console.log(currentCity)
        }

        // AUTOSETS THE CURRENT CITY VALUE
        // DETECTS CLICK EVENT
        useEffect(() => {  
            // CITY VALUE
            if(type.name =='city' && navigator.geolocation){
                getLocation();
            }
            // CLICK EVENT
            let handler = (e) => {
                if (!divRef.current.contains(e.target)){
                    listRef.current.className = 'closedListDiv'
                    setTemp('')
                    setSearchStarted(false)

                }else {
                    setTemp('')
                    getList();
                    setSearchStarted(true)  
                    listRef.current.className = 'listDiv'
                }
            };

            // GET THE LIST OF OPTIONS
            async function getList(){
                const resultList = await fetch(`${type.name}`).then(response => response.json())
                setList({
                    temporary: resultList,
                    permanent: resultList
                })
            }

            document.addEventListener('click', handler);
        }, []);

        // SEARCH WHILE TYPING
        function keyup(event){
            setTemp(event.target.value)
            let functionList = []
            for(let i = 0; i < list.permanent.length; i++){
                if(list.permanent[i].toLowerCase().includes(event.target.value.toLowerCase())){
                    functionList.push(list.permanent[i])
                }
            }

            setList({
                ...list,
                temporary: functionList
            })
        }

        // STOAGES THE DESIRED DATA WHEN CLICKED
        function choosed(q){
            fetch(`/search`,
            {
                method: 'POST',
                headers: {'X-CSRFToken': csrftoken},
                body: JSON.stringify({
                    spec: [type.name, q]
                 })
            })
            setSearchStarted(false)
            setSbValue(q)
            setTemp('')
            
        }

        // RENDERS
        return(
            <div ref={divRef}>
                <input type='text' placeholder={sbValue} value={tempValue} name={type.name} autoComplete='off' onChange ={keyup} className={searchStarted ? 'sb_border_on i_bx_s' : 'sb_border_off i_bx_s'}></input>
                <div className='closedListDiv' ref={listRef}>
                    {searchStarted && (list.temporary.length != 0 ? <ul>{list.temporary.map((l) => <li><button type='submit' onClick={() =>choosed(l)}>{l}</button></li>)}</ul> : <ul><li className='noResultList'>No results</li></ul>)}
                </div>
            </div>
        )

    }             
    
    return(
        <div style={{backgroundColor: 'white', borderRadius: '15px', padding: '10px'}}>
            <div className='sbDiv'>
                <SearchBars name='speciality'/>
                <SearchBars name='city'/>
            </div>
            <div className="search_btn">
                <a href="search"><button type="button" className="i_bx_s">Buscar doctor!</button></a>
            </div>
        </div>
    )
}
    
ReactDOM.render(<App/>, document.querySelector('#indx_search_cont'));