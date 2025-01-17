import GetDoc from "../js-components/getDoc";
import SearchBar from "../js-components/searchBar";
import GendersSelection from "../js-components/genders";
import Equis from "../js-components/equis";
import TakeDateSelection from "../js-components/takeDateFilter";
const { useEffect } = React;
function App () {
    const [renderCount, setRenderCount] = React.useState(0);
    const [mobile, setMobile] = React.useState(false)
    const [filtersOpen, setFiltersOpen] = React.useState(false)
    const breakpoint = 1200
    useEffect(() => {
        let handleSize =() => {
            setMobile(window.innerWidth <= breakpoint);
            if (window.innerWidth > breakpoint){
                setFiltersOpen(true)
            }else{
                setFiltersOpen(false)
            }
        }
        handleSize()
        window.addEventListener('resize', handleSize)

        return () => removeEventListener('resize', handleSize)
    },[breakpoint])

    const triggerReRender = () => {
        setRenderCount(prevCount => prevCount + 1);
      };

    return(
        <>  
            {mobile && 
                <div className="filter_btn_container">
                    <button onClick={() => setFiltersOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            {/* <!-- Top Line --> */}
                            <line x1="3" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            {/* <!-- Middle Line --> */}
                            <line x1="5" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            {/* <!-- Bottom Line --> */}
                            <line x1="7" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Filters
                    </button>
                </div>
            }
            <div className={filtersOpen ? "filters" : 'off'} >
                <header><h2>Filtros de busqueda</h2>{mobile && <Equis onAction={setFiltersOpen} setFalse={true}/>}</header>
                <hr></hr>
                <div className="sb_cont">
                    <h3>Especialidad</h3>
                    <SearchBar spec={'speciality'} update={triggerReRender} forSearch={true} forDoc={false} own={false}/>     
                </div>
                <div className="sb_cont">
                    <h3>Seguro</h3>
                    <SearchBar spec={'ensurance'} update={triggerReRender} forSearch={true} forDoc={false} own={false}/>     
                </div>
                <div className="sb_cont">
                    <h3>Clinica</h3>
                    <SearchBar spec={'clinic'} update={triggerReRender} forSearch={true} forDoc={false} own={false}/>     
                </div>
                <div className="sb_cont">
                    <h3>Ciudad</h3>
                    <SearchBar spec={'city'} update={triggerReRender} forSearch={true} forDoc={false} own={false}/>     
                </div>
                <hr></hr>
                <div className="gender_cont">
                    <h3>Genero</h3>
                    <GendersSelection onAction={triggerReRender}/>     
                </div>
                <hr></hr> 
                <div className="date_sistem_div" >
                    <TakeDateSelection onAction={triggerReRender}/>      
                </div>
            </div>


 
            <GetDoc reload={renderCount}/>
        </>
    );
}
const searchRoot = ReactDOM.createRoot(document.getElementById('searches_container'))
searchRoot.render(<App/>)