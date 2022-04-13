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
  home?: HTMLHyperlinkElementUtils;
  list?: PrismicRichText;
}

type Props = {
  allPages?: Array<{
    node?: Pages | undefined;
  }>;
}

function Pages({ pages }: { pages: Array<{
  node?: Pages | undefined;
}> }) {
  return (
    <ul>
      {pages?.map((item, i) => {
        const title = asText(item.node?.title);
        return (
          <li key={i}>
            <Link href={`/${item.node?._meta.uid}`}>
              {title}
            </Link>
          </li>
        );
      })}
    </ul>
  )
}

export default function Home({ allPages }: Props) {
  //console.log(pages);
  return (
    <section>
      <h1>h1 síður</h1>
      <Pages pages={allPages} />
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
  page(uid: $uid, lang: "is") {
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

export async function getServerSideProps() {


  const result = await fetchFromPrismic<PrismicResponse>(query);
  console.log('result :>> ', result);
  const allPages = result.allPages?.edges ?? [];
  console.log('allNews :>> ', allPages);

  return {
    props: { allPages }, // will be passed to the page component as props
  }
}
