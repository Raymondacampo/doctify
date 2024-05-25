const {useEffect} = React;  
const {useRef} = React;  

function App(stat){
    let btnref = useRef()

    useEffect(() => {
        let handler = (e) => {
            if(!btnref.current.contains(e.target)){
               cambioBoton({
                boton1: <button className='search_btn' type='button' onClick={() => {show()}}> {stat.name}...</button>
               })
            }
            
        };
        document.addEventListener('mousedown', handler)
    })


    const [boton, cambioBoton] = React.useState({
        boton1: <button className='search_btn' type='button' onClick={() => {show()}}> {stat.name}...</button>
    })

    async function show(){
        let popo;
        if(stat.name == 'specialities'){
            const items_cont = await fetch('specialities').then(response => response.json())
            popo = items_cont
            }
            cambioBoton({
                boton1: <div key={stat} className='option_cont'>
                            <div><input type='text' autoFocus onKeyUp={() => {ejecucion(event, popo)}}></input></div>
                            <div className='option_list'>{popo.map((p) => <button type='button' key={p} onClick={() => {choosedOption({p})}}className='search_btn'>{p}</button>)}</div>
                        </div>
            })
        }
    

        function choosedOption(t){
            console.log(t)
        }

        function ejecucion(event, popo){
            let lista = []
            if(event.target.value){
                let e = event.target.value
                popo.map((p) => {if(p.toLowerCase().includes(e.toLowerCase())){lista.push(p)}})

            }else{
                lista = popo
                }
                console.log(lista)
            cambioBoton({
                boton1: <div key={stat} className='option_cont'>
                        <div><input type='text'  autoFocus onKeyUp={() => {ejecucion(event, popo)}}></input></div>
                        <div className='option_list'>{lista.map((l) => <button type='button' key={l} onClick={() => {choosedOption({l})}}className='search_btn'>{l}</button>)}</div>
                    </div>

            })
            }
            
        

    return(
        <div className='btn_list' ref={btnref}>
            {boton.boton1}
        </div>

    )
}
    
ReactDOM.render(<App name='specialities'/>, document.querySelector('#index_speciality_disp'))
