import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'

type FormBtnProps = {
  toggleForm: Function
  text: string
  showForm: boolean
}

function ToggleFormButton(props: FormBtnProps) {
  return (
    <div className="w-max flex justify-around items-center rounded my-2 mx-auto border-2 border-gray-400 p-0.5 bg-white cursor-pointer
      hover:border-gray-700 hover:bg-blue-500 hover:text-white transition duration-100 ease-linear px-2"
      onClick={()=>{props.toggleForm()}}>

        <span className="text-lg rounded-lg p-0.5">{props.text} </span> 

        <span className={(props.showForm ? "rotate-45 text-red-500 " : "text-black ") + "transform transition align-middle mx-1 mt-0.5 text-xs fill-current"}>
          <FontAwesomeIcon icon={faPlus} />
        </span>
      </div>
  )
}

export default ToggleFormButton
