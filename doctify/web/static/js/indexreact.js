const {useEffect} = React;  
const {useRef} = React;  
let currVal = 'Busca la especialidad que deseas...';
let selection;
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
function App(stat){

    let btnref = useRef();

    // FUNC FUNC FUNC
    function Items_button(val){
        val = val.val;
        return(
            <button id='selection' value={val} name='selection' className='search_btn' type='button' onMouseDown={() => {show()}}> {val}</button>
        )
    }

    // FUNC FUNC FUNC
    function Items_list(data){
        let temporaryList = data.temporaryList;
        let lista = data.lista;
        return(<div key={stat} className='option_cont' >
                    <div className='items_txtbx'><input type='text' autoFocus onKeyUp={() => {ejecucion(event, lista)}}></input></div>
                    <div className='option_list'>{temporaryList.map((l) => <button type='button' key={l} onClick={() => {choosedOption(l)}}className='item_btn'>{l}</button>)}</div>
                </div>                
        )}


    useEffect(() => {
        let handler = (e) => {
            navigator.geolocation.getCurrentPosition(success, error);
        
            const error = () => {
                console.log('hola');
            }

            async function success(position){
                const currentCity = await fetch(`locateUser?lat=${position.coords.latitude}&lon=${position.coords.longitude}`).then(response => response.json());
            }

            if(!btnref.current.contains(e.target)){
               cambioBoton({
                boton1: <Items_button val={currVal}/>
               });
            };
            
        };
        document.addEventListener('mousedown', handler);
        
    }, []);


    const [boton, cambioBoton] = React.useState({
        boton1: <Items_button  val={currVal}/>
        });

    // FUNCTION SHOW LIST OF SPECIALITIES
    async function show(){
        let list;
        if(stat.name == 'specialities'){
            const items_cont = await fetch('specialities').then(response => response.json());
            list = items_cont;
            };
            cambioBoton({
                boton1: <Items_list lista={list} temporaryList={list}/>
            });
        };
    
        // FUNCTION TO SET THE SELECTED SPECIALITY
        function choosedOption(t){
            fetch(`searchInfo?speciality=${t}`, {
                method: 'POST',
                headers: {'X-CSRFToken': csrftoken}
            });
            currVal = t;
            selection = t;
            cambioBoton({
                boton1: <Items_button val={t}/>
            });
        }

        // FUNC FUNC FUNC
        function ejecucion(event, dataList){
            let list = [];
            if((event.target.value).length > 0){
                let e = event.target.value;
                dataList.map((p) => {if(p.toLowerCase().includes(e.toLowerCase())){
                    list.push(p)}
                });
            cambioBoton({
                boton1: <Items_list lista={dataList} temporaryList={list}/>
            }) ;
            }else{
                show();
            }};



    return(
        <div ref={btnref} className='btn_list indx_search_list'>
            {boton.boton1}
        </div>

    )
}
    
ReactDOM.render(<App name='specialities'/>, document.querySelector('#indx_speciality_cont'));
