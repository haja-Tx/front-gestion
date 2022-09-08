import { Agent } from "https"
import moment from "moment"

function Order({ order }) {
    return (
        <>
        <div className="flex justify-between p-4">
            <div>
                <h6 className="font-bold">Order Date : <span className="text-sm font-medium"> {moment(order.updatedAt).format('LLLL')}</span></h6>
                <h6 className="font-bold">Order ID : <span className="text-sm font-medium"> {order.numero}</span></h6>
            </div>
            <div className="w-40">
                <address className="text-sm">
                    <span className="font-bold"> Billed To : </span>
                    {order.client.nom}
                    {order.client.adresse}
                    {order.client.nif}
                    {order.client.stat}
                </address>
            </div>
            <div className="w-40">
                <address className="text-sm">
                    <span className="font-bold">Ship To :</span>
                    jkdlsa
                    
                </address>
            </div>
            <div></div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
            <th className="py-3 px-6">Code</th>
            <th className="py-3 px-6">Designation</th>
            <th className="py-3 px-6">Quantite</th>
            <th className="py-3 px-6">Prix Unitaire</th>
            <th className="py-3 px-6">Sous-total</th>
            </tr>
            </thead>
            <tbody>
            {order.elements.map((item: any) => (
            <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
                <td className="py-4 px-6">{item.product.code}</td>
                <td className="py-4 px-6">{item.product.designation}</td>
                <td className="py-4 px-6">{item.quantity}</td>
                <td className="py-4 px-6">{item.product.prixUnitaire}</td>
                <td className="py-4 px-6">{item.total}</td>
            </tr>
        ))}
            </tbody>
        </table>
        </>
    )
  }
  
  export async function getStaticPaths() {  
    return { paths: [], fallback: 'blocking' }
  }

  // This also gets called at build time
  export async function getStaticProps({ params }) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    // const user = req.session.user
    const res = await fetch(`https://127.0.0.1:8000/api/order-view/${params.id}`,({
        agent: new Agent({
          rejectUnauthorized: false,
      }),
      headers: {
        Accept: 'application/json',
        },
      }) as any)
    const order = await res.json()
  
    // Pass post data to the page via props
    return { props: { order } }
  }
  
  export default Order