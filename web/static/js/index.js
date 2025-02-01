const { useEffect } = React;
import SearchBar from "../js-components/searchBar"
import SmartBar from "../js-components/smartSearchbar";
function App(){
    return(
        <>
            {/* <SearchBar spec={'speciality'} forSearch={true} forDoc={false} own={false}/>
            <SearchBar spec={'city'} forSearch={true} forDoc={false} own={false}/>  */}
            <SmartBar index={true}/>
            <a className="link_btn" href="search">Search</a>
        </>        
    )
}
const root = ReactDOM.createRoot(document.getElementById('indx_search_cont'))
root.render(<App/>)
