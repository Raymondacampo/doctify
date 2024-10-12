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
}
let csrftoken = getCookie('csrftoken')
function App(){

    let divRef = useRef()
    let [checkbox, setCheckbox] = React.useState({
        both: false,
        male: false,
        female: false,
        currentGender: 'both'
    })

    let [search, setSearch] = React.useState()

    let [ph, setPh] = React.useState({
        speciality: null,
        city: null,
        ensurance: null,
        clinic: null
    })

    let [show, setShow] = React.useState({
        speciality: false,
        city: false,
        ensurance: false,
        clinic: false
    })

    let [showBig, setShowBig] = React.useState()
    let [showFilters, setShowFilters] = React.useState()

    let [doctors, setDoctors] = React.useState();

    let [filtersList, setFiltersList] = React.useState({
        speciality: null,
        tempSpeciality:null,
        city: null,
        tempCity: null,
        ensurance: null,
        tempEnsurance: null,
        clinic: null,
        tempClinic: null
    })

    let [pagination, setPagination] = React.useState({
        page:1,
        currentPage:null,
        prev:null,
        next: null
    })

    

    useEffect(() => {
        let spe;
        let ci;
        let ens;
        let cli;
        if(ph.speciality == 'All'){spe = 'Doctores'}else{spe = `${ph.speciality}s`};
        if(ph.city == 'All'){ci = ''}else{ci = `en ${ph.city}`};
        if(ph.ensurance == 'All'){ens = ''}else{ens = `que trabajan con seguros ${ph.ensurance}`};
        if(ph.clinic == 'All'){cli = ''}else{cli = `en ${ph.clinic}`};

        setSearch(`${spe} ${ci} ${ens} ${cli}`);
        getDoc();
    }, [pagination.page, checkbox.currentGender, ph])



    useEffect(() => {
        console.log('hola')
        getDoc();
        handleResize();
        phStartedValues();
        setCheckbox({
            ...checkbox,
            both: true,
            currentGender: 'both'
        });
        let handler = (e) => {
            if(divRef.current){
                if(!divRef.current.contains(e.target)){
                    setShow({show:false})
                    document.querySelectorAll('input').forEach((t) => t.value = '')
                }                
            }

            return() => document.removeEventListener('mousedown', handler);
        }


        document.addEventListener('mousedown', handler);
        window.addEventListener('resize', handleResize)
    }, []);
    // DEALS WITH HE RESIZE
    function handleResize(){
        if(window.innerWidth <= 1400){
            setShowFilters(false);
            setShowBig(true)
        }else{
            setShowFilters(true);
            setShowBig(false)
        }
        return () => removeEventListener('resize', handleResize)
    }

    // STARTER VALUES OF FILTERS
    async function phStartedValues(){
        const specialityStartedValue = await fetch('getvalue/speciality').then(response => response.json());      
        const cityStartedValue = await fetch('getvalue/city').then(response => response.json());
        const ensuranceStartedValue = await fetch('getvalue/ensurance').then(response => response.json());   
        const clinicStartedValue = await fetch('getvalue/clinic').then(response => response.json());
        setPh({
            speciality: specialityStartedValue,
            city: cityStartedValue,
            ensurance: ensuranceStartedValue,
            clinic: clinicStartedValue
        })  
    }

    // DOCTOR RENDERING FUNCTION
    async function getDoc(gender){
        if(!gender){gender = checkbox.currentGender}
        const result = await fetch(`doctors?speciality=${ph.speciality}&city=${ph.city}&ensurance=${ph.ensurance}&clinic=${ph.clinic}&gender=${gender}&page=${pagination.page}`).then(response => response.json())
        setPagination({
            ...pagination,
            currPage: result[1],
            prev: result[2],
            next: result[3]
        })
        if(result[0].length > 0){
            setDoctors(
                <div className='doctor_render'>
                    {result[0].map((d) => 
                        <div className='doctor'>
                            <div className='doc_info'>
                                <div className='doc_img'>
                                    <div>
                                        <img src={d.image} height='100px'></img>    
                                    </div>
                                </div>
                                <div className='doc_txt'>
                                    <div>
                                        <div className='name_ensurances'>
                                            <div><h2><a href={`${d.id}/profile`}>{d.name}</a></h2></div>         
                                            <div className='ensurances'>{d.ensurancesLogo.length <= 3 ? d.ensurancesLogo.map((e) => <img src={e} ></img>) : <h4>4+ Seguros</h4>}</div>                             
                                        </div>
                                        <div className='specialities'>
                                            {d.specialities.map((s) => {s})}
                                        </div>
                                        <div className='locations'>
                                            <div style={{display: 'flex', gap: '8px'}}>{d.cities.map((c) => <div className='city'>{c}<div className='pin'></div></div>)}</div>
                                        </div>
                                        
                                    </div>
                                    <hr></hr>
                                    <div>
                                        <p>{d.description}</p>
                                    </div>
                                </div> 
                            </div>
                            <div className='doc_btn'>
                                <a href={`${d.id}/profile`}>Ver perfil</a>
                            </div>
                        </div>
                    )}
                </div> 
            )            
        }else{
            setDoctors(
                <div className='no_result_div'>
                    <div>
                        <h1>No results</h1>
                        <h3>Try with something else</h3>                        
                    </div>

                </div>
            )
        }

    }

    // LOGIC BEHIND SELECTING A VALUE
    async function itemChoosed(item, type){
        console.log(item)
        await fetch(`/search`,
        {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            body: JSON.stringify({
                spec: [type, item]
             })
        })
            setShow({show:false})
            if(type == 'speciality'){
                setPh({...ph, speciality: item});
                setFiltersList({...filtersList, tempSpeciality: filtersList.speciality}) ;            
            }else if(type == 'city'){
                setPh({...ph, city: item});
                setFiltersList({...filtersList, tempClinic: filtersList.clinic}) ;           
            }else if(type == 'ensurance'){
                setPh({...ph, ensurance: item});
                setFiltersList({...filtersList, tempEnsurance: filtersList.ensurance});               
            }else if (type == 'clinic'){
                console.log(item)
                setPh({...ph, clinic: item});
                setFiltersList({...filtersList, tempClinic: filtersList.clinic});
            }
        
        document.querySelectorAll('input').forEach((t) => t.value = '')
    }

    // SHOWS LIST OF ITEMS WHEN CLICK
    async function showList(filter){
        let result;
        if(filter == 'speciality'){
            setShow({...show, speciality: true});
            if(!filtersList.speciality){
                result = await fetch(`${filter}`).then(response => response.json()),
                setFiltersList({
                    ...filtersList,
                    speciality: result,
                    tempSpeciality: result
                })                
            }
            
        }else if (filter == 'city'){
            setShow({...show, city: true});
            if(!filtersList.city){
                result = await fetch(`${filter}`).then(response => response.json()),
                setFiltersList({
                    ...filtersList,
                    city: result,
                    tempCity: result
                })                 
            }
     
        }else if (filter == 'ensurance' ){
            setShow({...show, ensurance: true});
            if(!filtersList.ensurance){
                result = await fetch(`${filter}`).then(response => response.json()),
                setFiltersList({
                    ...filtersList,
                    ensurance: result,
                    tempEnsurance: result
                })                 
            }
     
        }else if(filter == 'clinic'){
            setShow({...show,  clinic: true});
            if(!filtersList.clinic){
                result = await fetch(`${filter}`).then(response => response.json()),
                setFiltersList({
                    ...filtersList,
                    clinic: result,
                    tempClinic: result
                })                     
            }
 
        }

        document.querySelectorAll('input').forEach((t) => t.value = '')
    }

    // SHOWS RESULTS WHILE TYPING
    function keyUp(key, type){
        let list = [];
        key = key.target.value.toLowerCase();
        if(type == 'speciality'){
            for(let i = 0; i < filtersList.speciality.length; i++){
                if(filtersList.speciality[i].toLowerCase().includes(key)){list.push(filtersList.speciality[i])}
            }      
            setFiltersList({
                ...filtersList,
                tempSpeciality: list
            })      
        }else if (type == 'city'){
            for(let i = 0; i < filtersList.city.length; i++){
                if(filtersList.city[i].toLowerCase().includes(key)){list.push(filtersList.city[i])}
            }       
            setFiltersList({
                ...filtersList,
                tempCity: list
            })
        }else if (type == 'ensurance'){
            for(let i = 0; i < filtersList.ensurance.length; i++){
                if(filtersList.ensurance[i].toLowerCase().includes(key)){list.push(filtersList.ensurance[i])}
            } 
            setFiltersList({
                ...filtersList,
                tempEnsurance: list
            })      
        }else if (type == 'clinic'){
            for(let i = 0; i < filtersList.clinic.length; i++){
                if(filtersList.clinic[i].toLowerCase().includes(key)){list.push(filtersList.clinic[i])}
            }    
            setFiltersList({
                ...filtersList,
                tempClinic: list
            })   
        }

    }


    return(
        <div className={showBig && showFilters ? 'searches_container top': 'searches_container'}>
            {showFilters ?
                <div className='filters_background'>
                    <div className='filters'>
                        {showBig ?   
                            <div className='filters_title'>
                                <h3>Filtros de busqueda</h3>
                                <div className='change' onClick={() => setShowFilters(false)}>                
                                    <div className="bar1"></div>
                                    <div className="bar2"></div>
                                    <div className="bar3"></div>
                                </div>
                            </div>                      
                            :
                            <div className='filters_title'>
                                <h3>Filtros de busqueda</h3>
                            </div>
                        }

                        <div className='filters_container'>
                            <div className='filters_container_child' ref={divRef}>
                                <div>
                                    <h4>Especialidad</h4>
                                    <div className='filter' >
                                        <input type='text' onKeyUp={(e) => keyUp(e, 'speciality')} onMouseDown={() => showList('speciality')} placeholder={ph.speciality} ></input>
                                        {show.speciality && (filtersList.tempSpeciality ? <div className='listDiv'><ul>{filtersList.tempSpeciality.map((i) => <li><button onClick={() => itemChoosed(i, 'speciality')}>{i}</button></li>)}</ul></div> : <div className='listDiv'><ul><li><button>Loading...</button></li></ul></div>)}                            
                                    </div>                            
                                </div><hr></hr>
                                <div>
                                    <h4>Ciudad</h4>
                                    <div className='filter'>
                                        <input type='text' onKeyUp={(e) => keyUp(e, 'city')} onMouseDown={() => showList('city')} placeholder={ph.city} ></input>
                                        {show.city && (filtersList.tempCity ? <div className='listDiv'><ul>{filtersList.tempCity.map((i) => <li><button onClick={() => itemChoosed(i, 'city')}>{i}</button></li>)}</ul></div> : <div className='listDiv'><ul><li><button>Loading...</button></li></ul></div>)}                           
                                    </div>                            
                                </div><hr></hr>
                                <div>
                                    <h4>Seguro</h4>
                                    <div className='filter'>
                                        <input type='text' onKeyUp={(e) => keyUp(e, 'ensurance')} onMouseDown={() => showList('ensurance')} placeholder={ph.ensurance} ></input>
                                        {show.ensurance && (filtersList.tempEnsurance ? <div className='listDiv'><ul>{filtersList.tempEnsurance.map((i) => <li><button onClick={() => itemChoosed(i, 'ensurance')}>{i}</button></li>)}</ul></div> : <div className='listDiv'><ul><li><button>Loading...</button></li></ul></div>)}                           
                                    </div>                            
                                </div><hr></hr>
                                <div>
                                    <h4>Clinica</h4>
                                    <div className='filter'>
                                        <input type='text' onKeyUp={(e) => keyUp(e, 'clinic')} onMouseDown={() => showList('clinic')} placeholder={ph.clinic} ></input>
                                        {show.clinic && (filtersList.tempClinic ? <div className='listDiv'><ul>{filtersList.tempClinic.map((i) => <li><button onClick={() => itemChoosed(i, 'clinic')}>{i}</button></li>)}</ul></div> : <div className='listDiv'><ul><li><button>Loading...</button></li></ul></div>)}                            
                                    </div>                            
                                </div>
                            </div>
                            <div className='filters_container_child'>
                                <div>
                                    <h4>Genero:</h4>
                                    <div>
                                        <input type='checkbox' onChange={() => (setCheckbox({...!checkbox, both: true, currentGender: 'both'}), setPagination({...pagination, page:1}) )} checked={checkbox.both}></input> Ambos                               
                                    </div>
                                    <div>
                                        <input type='checkbox' onChange={() => (setCheckbox({...!checkbox, male: true, currentGender: 'male'}), setPagination({...pagination, page:1}))} checked={checkbox.male}></input> Masculino   
                                    </div>
                                    <div>
                                        <input type='checkbox' onChange={() => (setCheckbox({...!checkbox, female: true, currentGender: 'female'}), setPagination({...pagination, page:1}))} checked={checkbox.female}></input>  Femenino  
                                    </div>
                                </div>
                                {showBig &&(<div className='doc_btn'><button type='button' onClick={() => setShowFilters(false)}>GO</button></div>)}

                            </div>
                        </div>

                    </div>             
                </div>
            :
                <div className='mobile_filter_div' id='mob_filters'>
                    <button type='button' onClick={() => setShowFilters(true)}>Filters</button>
                    <div className='filters_data'>{search}</div>
                </div>
            }
            
            <div className='doctors'>
            {showFilters &&(<div className='filters_data'>{search}</div>)}   
                <div className='doctor_container'>
                    {doctors}  
                    <div className='pagination_div'>
                        {pagination.prev &&(<button type='button' onClick={() => setPagination({...pagination, page: pagination.page-1})}><div className='arrow left'></div><span>prev</span></button>)}
                        {pagination.currPage && (<span>{pagination.currPage}</span>)}
                        {pagination.next &&(<button type='button' onClick={() => setPagination({...pagination, page: pagination.page+1})}><span>next</span><div className='arrow right'></div></button>)}
                    </div>                    
                </div>

            </div>
            
        </div>
    )
}
ReactDOM.render(<App />, document.querySelector('#searches'))