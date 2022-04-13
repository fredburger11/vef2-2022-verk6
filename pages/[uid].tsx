import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { fetchFromPrismic } from '../api/prismic';
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { PrismicRichText } from '@prismicio/react'
import { asText } from '@prismicio/helpers'

type PrismicRichText = any;

type Pages = {
  _meta?: {
    uid?: string;
  }
  title?: PrismicRichText;
  //home?: HTMLHyperlinkElementUtils;
  list?: PrismicRichText;
}

type Props = {
  page: Pages | undefined;
 
}



export default function Home({ page }: Props) {
  //console.log(pages);
  return (
    <section>
      <h1>TESTING</h1>
      <h1>{asText(page.title)}</h1>
    </section>
  );
}

const query = `
fragment page on Page {
  _meta {uid}
  
  title

  list{
    picture
    mylink{_linkType}
    accordion
    content
  }
}

query($uid: String = "") {
  page(uid: $uid, lang: "en") {
    ...page
  }
  allPages(sortBy: title_ASC, first: 5) {
    totalCount
    pageInfo{
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node{
        ...page
      }
    }
  }
}
`;

type PrismicResponse = {
  pages?: Pages;
  allPages?: {
    edges?: Array<{
      node?: Pages;
    }>;
  }
}

export async function getServerSideProps({ params }) {

  const { uid } = params.uid;
  const result = await fetchFromPrismic<PrismicResponse>(query, { uid });
  
  console.log('result :>> ', result);
  //const allPages = result.allPages?.edges ?? [];
  const page = result.allPages?.edges ?? null;
  
  if(!page) {
      return {
          notFound: true,
          props: {},
      };
  }

  return {
    props: { page }, // will be passed to the page component as props
  }
}
