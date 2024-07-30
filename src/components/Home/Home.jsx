import 'react'
import startImage from '../../assets/startImg.png'
import './Home.css'
import { Link } from 'react-router-dom'
export default function Home(){
    return(
        <>
        <h1>NIC Detail Checker</h1>
        <div className='image'>
            <div className="click">
                    <h2><Link to={"/details"}>Start</Link></h2>
            </div>
            <img src={startImage} alt="" width="100%"/>
        </div>
            <h3 className='devTag'>Developed by Sameera Madushan</h3>
        </>
    )
}