import React from "react";
import Layout from "./components/Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import { User } from "../pages/api/user";

import { InferGetServerSidePropsType } from "next";

export default function SsrProfile({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <h1>Your profile</h1>
      <h2>
        Info perso
      </h2>

      {user?.isLoggedIn && (
        <>
          <p style={{ fontStyle: "italic" }}>
            data
          </p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </Layout>
  );
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

  return {
    props: { user: req.session.user },
  };
},
sessionOptions);
