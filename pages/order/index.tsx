import { Agent } from 'https'
import moment from 'moment'


function Index({ data }) {
    
    return (
      <>
      <h1>Liste des commandes</h1>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
          <th className="py-3 px-6">Numero</th>
          <th className="py-3 px-6">Date</th>
          <th className="py-3 px-6">Total</th>
          <th className="py-3 px-6">Client</th>
          </tr>
        </thead>
        <tbody>
        {data.map((item: any) => (
          <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
            <td className="py-4 px-6">{item.numero}</td>
            <td className="py-4 px-6">{moment(item.createdAt).format('LLLL')}</td>
            <td className="py-4 px-6">{item.total}</td>
            <td className="py-4 px-6">{item.client.nom}</td>
          </tr>
      ))}
        </tbody>
      </table>
      </>
    )
  }
  
  export async function getServerSideProps({req, res} ) {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    )
    // Fetch data from external API
    
    res = await fetch(`https://127.0.0.1:8000/api/commandes`,{
      agent: new Agent({
        rejectUnauthorized: false,
     }),
     headers: {
      Accept: 'application/json',
      },
    })
    const data = await res.json()
    // Pass data to the page via props
    return { props: { data } }
  }
  export default Index