const {useEffect} = React;
const {useRef} = React; 
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
}
let csrftoken = getCookie('csrftoken')
function App(){
    
    let [messages, setMessages] = React.useState(false);

    let [formButton, setFormButton] = React.useState(false) 
    
    const container = document.querySelector('#signin');


    // IF SIGNIN BUTTON IS CLICKED OPEN OR CLOSE DIV
    container.className = formButton ? 'signin_div': '';


    // login_form.onSubmit=
    useEffect(() => {
        let handler = () =>{
            setFormButton(true)
            return() =>  document.querySelector('#signinbtn').removeEventListener('click', handler)
            }
            
        document.querySelector('#signinbtn').addEventListener('click', handler)
    },[])

    // HANDLES WITH THE SUBMITFORM BUTTON
    function handleSubmit(e){
        e.preventDefault();
        fetch(`/signin`,
        {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            body: JSON.stringify({
                user: document.querySelector('#form_user').value,
                password: document.querySelector('#form_password').value
             })
        }).then(response => response.json()).then(data => {
            if(data == true){
                location.reload();  
            }else{
                setMessages(data[1])
                console.log(data[1])
            }
        })
    }
    

    return(
        <div>
            <form onSubmit={(e) => handleSubmit(e)} method="post">
                {formButton &&(
                    <div className='signin'>
                        <div className='close'>
                            <div className='change' onClick={() => setFormButton(false)}>
                                <div className="bar1"></div>
                                <div className="bar2"></div>
                                <div className="bar3"></div>                        
                            </div>                            
                        </div>

                        <div>
                            <h1>Sign in!</h1>
                            {messages &&(
                                <div className='messages'>
                                    <span>{messages}</span>
                                </div>                                
                            )}
                            <div className="input_form">
                                <label for="user">User:</label>
                                <input id='form_user' type="text" name="user" placeholder='username' required></input>
                            </div>
                            <div className="input_form">
                                <label for="password">Password:</label>
                                <input  id='form_password' type="password" name="password" placeholder='password' required></input>
                                <a href="/accounts/password/reset/">Forgot password?</a>
                            </div>
                            <div className="submit_btn">
                                <input type="submit" value="Sign in!" onSubmit={(e) => handleSubmit(e)}></input>
                            </div>      
                        </div>
                        <div className='extra_container'>
                            <form action="/accounts/google/login/?process=login" method="post">
                            <input type='hidden' name="csrfmiddlewaretoken" value={csrftoken}></input>

                                <button type="submit" >
                                    <div className='google_form'>
                                        <img src='static/images/google.png' height='30px'></img>
                                        <span>Sign in with Google</span>
                                    </div> 
                                </button>
                            </form>                           
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

ReactDOM.render(<App />, document.querySelector('#signin'))