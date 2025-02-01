import Equis from "../js-components/equis";
import csrftoken from "../js-functions/cookie";
const {useEffect} = React;
function App(){
    const [openDelete, setOpenDelete] = React.useState(false)
    useEffect(() => {
        let handler = () => {
            setOpenDelete(true)
        }
        document.getElementById('delete_button').addEventListener('click', handler)
    },[])
    return(
        <>
            {openDelete && 
            <div className="manage_body">
                <div className="manage_container">
                <Equis onAction={setOpenDelete}/>
                    <div className="manage_content">
                        <h2>Delete account?</h2>
                        <form action="delete_account" method="post" >
                            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken}></input>
                            <button type="submit" className="cancel">Delete account</button>   
                        </form>                     
                    </div>

                </div>
            </div>}
        </>
    )
}
const deleteRoot = ReactDOM.createRoot(document.getElementById('delete_content'))
deleteRoot.render(<App/>)

// const del_btn = document.getElementById('delete_button')
// del_btn.addEventListener('click', () => {
//     const container = document.createElement('div');

//     container.innerHTML = `
//     <div class="manage_body">
//         <div class="manage_container">
//             <h1>Delete account?</h1>
//             <a href="myaccount/delete_account" target="_blank">Delete account</a>
//         </div>
//     </div>
//     `;

//     // const script = document.createElement('script');
//     // script.textContent = `
//     // // This is the script code you want to run.
//     // console.log("Script inside dynamically created div is running!");
//     // `;

//     // // Append the container and then the script
//     document.body.appendChild(container);
//     // document.body.appendChild(script);
//     console.log('delete')
// })