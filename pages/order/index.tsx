import { Agent } from 'https'
import { withIronSessionSsr } from 'iron-session/next';
import moment from 'moment'
import Link from 'next/link';
import { sessionOptions } from '../../lib/session'
import { User } from '../api/user';


function Index({ orders, user }) {
    return (
      <>
      <h1>Liste des commandes {user.customer.company}</h1>
      <Link href="/order/form">
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Nouveau commande</a>
      </Link>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
          <th className="py-3 px-6">Numero</th>
          <th className="py-3 px-6">Date</th>
          <th className="py-3 px-6">Total</th>
          <th className="py-3 px-6">Client</th>
          <th className="py-3 px-6">Action</th>
          </tr>
        </thead>
        <tbody>
        {orders.map((item: any) => (
          <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
            <td className="py-4 px-6">{item.numero}</td>
            <td className="py-4 px-6">{moment(item.createdAt).format('LLLL')}</td>
            <td className="py-4 px-6">{item.total}</td>
            <td className="py-4 px-6">{item.client.nom}</td>
            <td className="py-4 px-6"><Link href={{
              pathname: '/order/[id]',
              query: { id: item.id },
            }} >View</Link></td>
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
    const user = req.session.user;
  
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
      const roles = req.session.user.roles
      const user = req.session.user
      const str = 'ROLE_ADMIN';
      var url
      const found = roles.find((element) => {
        return element.toLowerCase() === str.toLowerCase();
      });
      
      if (found !== undefined) {
        url = `https://127.0.0.1:8000/api/customers/${user.customer.id}`
      } else {
        url = `https://127.0.0.1:8000/api/users/${user.id}`
      }
      
      const response = await fetch(url,({
        agent: new Agent({
          rejectUnauthorized: false,
      }),
      headers: {
        Accept: 'application/json',
        },
      }) as any)
      const data = await response.json()
      const orders = data.commandes
      // Pass data to the page via props
      
      return { props: { user, orders } }

      }
  
  },
  sessionOptions);


  export default Index