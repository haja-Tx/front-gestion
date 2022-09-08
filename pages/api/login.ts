import type { User } from "./user";

import { Agent } from 'https'
import { withSessionRoute } from "../../lib/session";

export default withSessionRoute(loginRoute);
async function loginRoute(req: any, res: any){

    try{
      const response = await fetch(`https://127.0.0.1:8000/api/login`,({
        agent: new Agent({
          rejectUnauthorized: false,
      }),
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }) as any)
      const data = await response.json()
      switch (data.status) {
        case 200:
          const {email, lastname, imageName, id, roles, customer} = JSON.parse(data.user.content)
          const user = { isLoggedIn: true, email, lastname, imageName, id, roles, customer } as User;
          req.session.user = user;
          await req.session.save();
          res.json(user);
          break;
        default:
          res.status(403).json({ message: data.message });
          break;
      }
      
    }catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }

  }


