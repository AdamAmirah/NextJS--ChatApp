import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { theme } from "../chakra/theme";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/graphql/apollo-client";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
          <Toaster position="top-center" reverseOrder={false} />
          <Head>
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon.png"
            />
            <title>iMessage</title>
          </Head>
        </ChakraProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}

export default MyApp;
