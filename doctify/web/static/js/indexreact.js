

function App(){

    const [data, setData] = React.useState({
        datalist:'hola'
        })

    function show(event, t){
        console.log(t)
            fetch(`posibilities/speciality?match=''`).then(response => response.json()).then(data =>{
                setData({
                    datalist:data[0].name
                })
            });


    } 
    function dataListing(){
        var indents = [];
        for (var i = 0; i < 10; i++) {
          indents.push(<span className='indent' key={i}>{i}</span>);
        }
        return indents;
        }
    
    return(
        <div>
        <input onClick={(event) => show(event, 'speciality')} type="button" value="specialities" id="speciality"></input>
            <div>
                <dataListing />
            </div>
        </div>
    )}



ReactDOM.render(<App />, document.querySelector('#select_father'))
