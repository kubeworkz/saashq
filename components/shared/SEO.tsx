import Head from "next/head";


export default function SEO(props: { pageTitle: string }){
    return (
        <Head>
     
        <title>SaaS — {props.pageTitle}</title>
      </Head>
    )
}