const {useEffect} = React;
const {useRef} = React;
import handleTyping from "../js-functions/handleTyping";
import { valueSearch } from "../js-functions/postSearchVal"
const SearchBar = ({spec, update, forSearch, own, val, onAction, reload}) => {
    let [specList, setList] = React.useState()
    let [tempList, setTemp] = React.useState()
    let [open, setOpen] = React.useState()
    let [selection, setSelection] = React.useState(`${spec}`)

    let specRef = useRef()
    let textRef = useRef()


    useEffect(() => {
        console.log(reload)
        getSpec()
        async function getSpec() {
            const result = await fetch(`/get_spec?spec=${spec}&for_search=${forSearch}&my_spec=${own}`).then(response => response.json())
            if (forSearch){
                setList(result[0])
                setTemp(result[0])
                forSearch && setSelection(result[1])
            }else{
                setList(result)
                setTemp(result)
            }

        }
    },[reload])

    useEffect(() => {
        let handleClick = (e) => {
            if (specRef.current && !specRef.current.contains(e.target)){
                setOpen(false)
                setTemp(specList)
                textRef.current.value = ''
            }
        }
        if(open){
            document.addEventListener('mousedown', handleClick)      
        }
    },[open])
    
    const done = (s) => {
        setTemp(specList)
        setSelection(s)
        setOpen(false)
        textRef.current.value = '';
        update && update()            
        onAction && onAction(s)
    }

    return(
        <div className="search_bar" ref={specRef}>
            <input type='text' ref={textRef} placeholder={selection ? selection : spec} onClick={()=> setOpen(true)} onChange={(e) => handleTyping(e.target.value, setTemp, specList)}></input>
            {val && <input type="hidden" name="spec" value={val} />}
            {open && tempList &&
                (!forSearch && spec == 'ensurance' ?
                <ul>
                    {tempList.map((s, index) => s[1] ? <li key={index} onClick={() => done(s[0])}><img src={s[1]}></img>{s[0]}</li> 
                    : <li key={index}>{s}</li> )}
                </ul>
                :
                <ul>
                    {tempList.map((s, index) => <li key={index} onClick={() => forSearch && update ? [valueSearch(s, spec, update), console.log(s, spec), done(s)]: done(s)}>{s}</li>)}
                </ul>)
            }
        </div>
    );
}

export default SearchBar;