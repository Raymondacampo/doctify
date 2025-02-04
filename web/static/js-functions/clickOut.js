const {useEffect} = React;

export function useClickOut(ref, onAction, show, extraFunction){
    useEffect(() => {
        extraFunction && extraFunction()
        let handleClick = (e) => {
            if (!ref.current.contains(e.target)){
                onAction(false)
            }
        }
        if(show){
            document.addEventListener('mousedown', handleClick)      
        }
         
        
        if (show){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = '';
        }  

        return() => {
            document.removeEventListener('mousedown', handleClick)
        }   

    },[show])
}

