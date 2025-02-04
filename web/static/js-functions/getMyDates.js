
const {useEffect} = React;
const getMyDatesList = async (setList, active, setIsLoading, p, setNext) => {
    setIsLoading &&  setIsLoading(true); 
    try {
        const list = await fetch(`mydates?active=${active}&page=${p}`).then(response => response.json()); // Adjust URL as needed
        console.log(list)
        if(!active){
            setList((prevList) => [...prevList, list[0]],) 
            setNext(list[1])
        }else{
            console.log(list)
            setList(list)
        }
         
    } catch (error) {
        console.error('Error fetching posts:', error);
    } finally {
        setIsLoading &&  setIsLoading(false);   
                  
    }
}


export const MyActiveDates = ({onAction, count}) => {
    const [list, setList] = React.useState()
    const [isDoctor, setDoctor] = React.useState(false)
    useEffect(() => {
        getMyDatesList(setList, true, false)
    },[count])

    useEffect(() => {
        const d = async() => {
            const isdoc = await fetch('user_info').then(response => response.json())
            setDoctor(isdoc[1])
            // console.log(isdoc[1])
        }
        d();
    },[])

    useEffect(() => {
        console.log('e', list)
    },[list])

    return(
        <>
        <h1>Mis citas</h1><p style={{marginBottom: '1.5rem'}}>Estas son todas las citas que has creado con tu cuenta de Doctify.</p>
        {list && list[0].length > 0 ?
            <>
                <h3>Active dates</h3><hr className="enmark"></hr>
                {list[0].map((d, index) => 
                    <div key={index} className='date active_div'>
                            <div className='full'>
                                {d.img && 
                                <div>
                                    <img style={{height: '70px', borderRadius: '100px'  }} src={d.img}></img> 
                                </div>}
                                <div > 
                                    <span className='big'>Cita con {d.name}</span>
                                    <div style={{display: 'flex', flexDirection: 'column',marginTop: '5px'}}>
                                        <span className='small'>Fecha: <b> {d.date}</b></span>
                                        <span className='small'>Hora: <b>{d.time}</b></span>                                        
                                    </div>
                                    <span className='small'>Lugar: <b>{d.place}</b></span>                                    
                                </div>

                            </div> 
                        <button className='cancel' onClick={() => onAction(d.date_id, `Cancelar cita con ${d.name} el ${d.date}`) }>Cancel</button>
                    </div>
                )}
            </>
        :
        <div>
            {!isDoctor && 
            <div className='no_dates'>
                <b className='bigger'>No tienes ninguna cita pendiente!</b>
            <div>
                <span className='med'>Utiliza nuestro buscador para encontrar el doctor que buscas!</span>
                <a href='/search'>Search</a>
            </div>
            </div>   }
        </div>
        
        }
        </>
    )
}

export const MyUnactiveDates = () => {
    const [list, setList] = React.useState([])

    let [loading, setIsLoading] = React.useState(false)
    let [page, setPage] = React.useState(1)
    const [next, setNext] = React.useState(true)

    useEffect(() => {
        getMyDatesList(setList, false, setIsLoading, page, setNext)
    },[])

    useEffect(() => {
        if(list[0]){
            setPage((page) => page + 1)  
        }
        console.log(list)

    }, [list])

    return(
        <>
        {list[0] && list[0].length > 0 &&
            <>
                <h3 style={{marginTop: '1.5rem'}}>Previous dates</h3><hr className="enmark"></hr>
                {list.map((l, index) => 
                    <div key={index}>
                        {l.map((d, index) => 
                        <div key={index} className='date unactive_div'>
                            <div className="full">
                                {d.img && 
                                <div>
                                    <img style={{height: '70px', borderRadius: '100px'  }} src={d.img}></img> 
                                </div>}
                                <div>
                                    <span className='big'>Cita con {d.name}</span>
                                    <div style={{display: 'flex', flexDirection: 'column', marginTop: '5px'}}>
                                        <span className='small'>Fecha: <b>{d.date}</b></span>
                                        <span className='small'>Hora: <b>{d.time}</b></span>                                        
                                    </div>
                                    <span className='small'>Lugar: <b>{d.place}</b></span>                                    
                                </div>

                            </div>                          
                        </div>)}    
                    </div>   
                )}

                {next && 
                    <button onClick={() => getMyDatesList(setList, false, false, page, setNext)} disabled={loading}>
                        {loading ? 'Loading...' : 'Load More'}
                    </button>            
                } 
            </>
        }
        </>
    )
}