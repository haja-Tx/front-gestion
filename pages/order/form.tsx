import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Agent } from "https"
import { withIronSessionSsr } from "iron-session/next"
import { useState } from "react"
import { sessionOptions } from "../../lib/session"
import { User } from "../api/user"
import { v4 as uuid } from 'uuid'
import Link from 'next/link'

function Form({products}){
    
    const [elements, setElements] = useState([])
    const [newElement, setNewElement] = useState({
        designation: "Choose product",
        quantity: 0,
        remise: 0
    })
    const handleChange = event => {
        setNewElement(event.currentTarget.value)
        
    }

    const handleDelete = id =>{
        const listElements = elements.slice()
        const index = listElements.findIndex(function(element){
            return element.id === id
        })

        listElements.splice(index,1)
        setElements(listElements)
    }
    const handleSubmit = event => {
        event.preventDefault()
        const id = uuid()
        const designation = event.target.designation.value
        const product = products.find(function(product){
            return product.designation === designation
        })
        const total = event.target.quantity.value * product.prixUnitaire
        const data = {
            id: id,
            productId:product.id,
            designation: designation,
            quantity: event.target.quantity.value,
            remise: event.target.remise.value,
            pu: event.target.designation.getAttribute("data-pu"),
            total: total
          }
        
        const newElements = elements.slice()
        newElements.push(data)
        setElements(newElements)
        setNewElement({
            designation: "Choose product",
            quantity: 0,
            remise: 0
        })
        console.log(newElements)
    }
    return (
        <>
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <div className="flex items-center border-b border-teal-500 py-2">
                <select onChange={handleChange} value={newElement.designation} id="designation" name="designation" className="dark:bg-gray-800 dark:text-gray-400 mt-1 max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <option value="Choose product">Choose product</option>
                    {products.map(product => (<option data-pu="{product.prixUnitaire}">{product.designation}</option>))}
                </select>
                <input onChange={handleChange} value={newElement.quantity} id="quantity" name="quantity" className="dark:text-gray-400 appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="number" min="0" aria-label="Full name" required/>
                <input onChange={handleChange} value={newElement.remise} id="remise" name="remise" className="dark:text-gray-400 appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="number" min="0" aria-label="Full name" required/>
                <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                Add
                </button>
            </div>
        </form>
        <Link href="#"><a className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save <PlusCircleIcon/></a></Link>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
          <th className="py-3 px-6">Designation</th>
          <th className="py-3 px-6">Quantite</th>
          <th className="py-3 px-6">Remise</th>
          <th className="py-3 px-6">Total</th>
          <th className="py-3 px-6">Action</th>
          </tr>
        </thead>
        <tbody>
        {elements.map((item: any) => (
          <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
            <td className="py-4 px-6">{item.designation}</td>
            <td className="py-4 px-6">{item.quantity}</td>
            <td className="py-4 px-6">{item.remise}</td>
            <td className="py-4 px-6">{item.total}</td>
            <td className="py-4 px-6"><button onClick={()=>handleDelete(item.id)}><TrashIcon className="h-6 w-6" aria-hidden="true" /></button></td>
          </tr>
      ))}
        </tbody>
      </table>
        </>
    )
}

export const getServerSideProps = withIronSessionSsr(async function ({
    req,
    res,
  }) {
    const user = req.session.user
  
    if (user === undefined) {
      res.setHeader("location", "/login");
      res.statusCode = 302;
      res.end();
      return {
        props: {
          user: { isLoggedIn: false, email: "", lastname: "", id: null, customer: null } as User,
        },
      };
    }
    else{
        res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
      )
      // Fetch data from external API
      const user = req.session.user
      
      const url = `https://127.0.0.1:8000/api/customers/${user.customer.id}`
      
      
      const response = await fetch(url,({
        agent: new Agent({
          rejectUnauthorized: false,
      }),
      headers: {
        Accept: 'application/json',
        },
      }) as any)
      const data = await response.json()
      const products = data.products
      // Pass data to the page via props
      
      return { props: { products } }

      }
  
  },
  sessionOptions);

export default Form