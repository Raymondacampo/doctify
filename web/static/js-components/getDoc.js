const {useEffect} = React;
import { VirtualIcon, InPersonIcon, LocationIcon, DateSisIcon } from "./icons";
const GetDoc = ({reload}) => {
    let [doc, setDoc] = React.useState() 
    let [pagination, setPagination] = React.useState({
        page:1,
        currentPage:null,
        prev:null,
        next: null
        })

    function handlePagination(order){
        if (order == 'next'){
            setPagination({
                ...pagination,
                page: pagination.page + 1
            })            
        }else if(order == 'prev'){
            setPagination({
                ...pagination,
                page: pagination.page - 1
            })  
        }
    } 


    const fDoctor = async () => {
        const result = await fetch(`doctors?page=${pagination.page}`).then(response => response.json())
        setPagination({
            ...pagination,
            currPage: result[1],
            prev: result[2],
            next: result[3]
        })
        setDoc(
            <div className='doctor_render'>
                {result[0].length > 0 ? 
                <>
                    {result[0].map((d, index) => 
                    <div key={index} className='doctor'>
                        <div className="content">
                            <div className="section_1">
                                <img src={d.image} height='100px'></img>    
                            </div>                    
                            <div className="section_2">
                                <div className="presentation">        
                                    <div className="name_spec">
                                        <div className="name">
                                            <h3><a href={`${d.id}/profile`}>Dr. {d.name}</a></h3>
                                            <div className='ensurances'>
                                                {d.ensurances.length <= 1 ? d.ensurances.map((e, index) => <img key={index} src={`static/images${e.logo}`} ></img>) : <h5 key={index}>{d.ensurances.length}<span style={{fontSize: '14px'}}>+</span> Seguros</h5>}
                                            </div>        
                                        </div>
                                        <hr></hr>
                                        <div className='info_1'>
                                            <div className="specialities">{d.specialities.map((s, index) => <span key={index}>{s.name}</span>)}</div>
                                            <div className="rating_container">
                                                <span className ="fa fa-star checked"></span> 
                                                <a href={`${d.id}/profile`}>{d.average_rating ? <div className="rate_content"><span>{d.average_rating}</span><span className="count">•</span><span className="count">{d.review_count} reviews</span></div> : <div className="rate_content"><span>No ratings</span></div>}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="info_2">
                                    {d.takes_dates && <div><DateSisIcon/>Sistema de citas</div>}

                                    {(d.virtually && d.in_person) ? <div><InPersonIcon/><VirtualIcon/>Virtual y presencial</div> : 
                                    <>
                                        {d.in_person && <div><InPersonIcon/>Presencial</div>}
                                        {d.virtually && <div><VirtualIcon/>Virtual</div>}                                    
                                    </>}
                                    
                                    {d.clinics && 
                                    <div className='locations'>
                                        <div style={{display: 'flex', gap: '1px 5px', flexWrap: 'wrap'}}>{d.clinics.map((c, index) => 
                                            <div key={index} className='city'><LocationIcon/>{c.name}, {c.city}.</div>)}
                                        </div>
                                    </div>}                            
                                </div>
                            </div>                        
                        </div>
                        <a className="profile_button" href={`${d.id}/profile`}>Ver perfil</a>
                    </div>
                    )}
                    <div className="pagination">
                        <div >{result[2] && <button onClick={()=> handlePagination('prev')}><i class="arrow left"></i> Prev</button>}</div>
                        <div>{result[1] && <p>{result[1]}</p>}</div>
                        <div>{result[3] && <button onClick={()=> handlePagination('next')}>Next <i class="arrow right"></i></button>}</div>
                    </div>
                </>
                :
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '5rem'}}>
                        <img src="static/images/dclogo.png" height={'100px'}></img>
                        <h1>No resulsts</h1>
                        <p>Try searching somethingd else</p>
                    </div>  
                } 
            </div> 
        )       
    };

    useEffect(() => {
        fDoctor();
    }, [pagination.page, reload])

    return( 
        <>
            {doc}
        </>
        )
}

export default GetDoc;