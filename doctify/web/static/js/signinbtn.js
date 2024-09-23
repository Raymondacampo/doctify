const {useEffect} = React;
const {useRef} = React; 

function App(){
    const buttonsDiv = document.querySelector('#signin_div');

    let [mobile, setMobile] = React.useState(false);
    let [mobileOpen, setMobileOpen] = React.useState();


    buttonsDiv.style.display = mobileOpen ? 'block' : 'none';

    useEffect(() => {
        handler()
        function handler(){
            if(window.innerWidth <= 900){
                setMobile(true); 
                setMobileOpen(false);
                buttonsDiv.style.display = 'none';
            } else {
                setMobile(false);
                setMobileOpen(true); 
            };
            return ()=> removeEventListener('resize', handler)
        };
        window.addEventListener('resize', handler);

    }, []);

    function toggleMobile(){
        setMobileOpen(!mobileOpen);
    }
    
    return(
        <div onClick={() => toggleMobile()}>
            {mobile &&(

            )}
        </div>
    )

}   

ReactDOM.render(<App />, document.querySelector('#nav_bar_btn'));