import GetDoc from "../js-components/getDoc";
import SearchBar from "../js-components/searchBar";
import GendersSelection from "../js-components/genders";
function App () {
    const [renderCount, setRenderCount] = React.useState(0);

    const triggerReRender = () => {
        setRenderCount(prevCount => prevCount + 1);
      };

    return(
        <>
            <SearchBar spec={'speciality'} update={triggerReRender} forSearch={true} forDoc={false}/>    
            <SearchBar spec={'clinic'} update={triggerReRender} forSearch={true} forDoc={false}/>
            <SearchBar spec={'ensurance'} update={triggerReRender} forSearch={true} forDoc={false}/>
            <SearchBar spec={'city'} update={triggerReRender} forSearch={true} forDoc={false}/>  
            <GendersSelection onAction={triggerReRender}/>    
            <GetDoc reload={renderCount}/>
        </>
    );
}
const searchRoot = ReactDOM.createRoot(document.getElementById('searches_container'))
searchRoot.render(<App/>)