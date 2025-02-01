const CustomAlert = ({valid, message}) => {
    return(
        <div className="alertContent">
            <div>
                <img src={valid ? '/static/images/check.png' : '/static/images/error.png' }></img>
                <h3 style={{fontWeight: '100', letterSpacing: '1px'}}>{message}</h3>                    
            </div>
        </div>
    )
}
 export default CustomAlert;