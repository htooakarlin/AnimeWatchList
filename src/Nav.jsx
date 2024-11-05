import { useContext } from "react"
import { themeContext } from "./App"


export default function Nav({children, onClick}){
    const {theme} = useContext(themeContext);
    const className = 'nav-Catagory-' + theme;
    return(
        <div onClick={onClick} className={className}>{children}</div>
    )
}