import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { fetchFromPrismic } from '../api/prismic'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { PrismicRichText } from '@prismicio/react'
import { asText } from '@prismicio/helpers'

type PrismicRichTextType = any;

type Homs = {
  title?: PrismicRichTextType;
  intro?: PrismicRichTextType;
  links?: PrismicRichTextType;
}

type Projects = {
  _meta?: {
    uid?: string;
  }
  title?: PrismicRichTextType;
  link?: PrismicRichTextType;
  detail?: PrismicRichTextType;
  
}

type Props = {
  allProjectss?: Array<{
    node?: Projects | undefined;
  }>;

  allHoms?: Array<{
    node?: Homs | undefined;
  }>;
}

function Projects({ project }: { project: Array<{
  node?: Projects | undefined;
}> }) {
  return (
    <ul>
      {project.map((item, i) => {
        const title = asText(item.node?.title);
        return (
          <li key={i}>
            <Link href={`/${item.node?._meta?.uid}`}>
              {title}</Link>
          </li>
        )
      })}
    </ul>
  )
}

export default function Home({ allProjectss, allHoms }: Props) {
  console.log('allHoms : >> ', allHoms);
  //console.log('allProjects :>> ', allProjectss);
  //console.log('homes :>> ', allHoms.node[0].title);
  return (
    <section>
      <h1>Forsíða</h1>
      <p>Verkefni sem ég hef gert.</p>
      <Projects project={allProjectss} />
    </section>
  );
}



const query = `
fragment projects on Projects {
  _meta{
    uid
  }
  title
  link{
    _linkType
    __typename
  }
  detail
  image
  linktitle
  links
}

query($uid: String = "") {
  projects(uid: $uid, lang: "is") {
    ...projects
  }  
  allProjectss {
    totalCount
    pageInfo{
      startCursor
      endCursor
    }
    edges {
      node {
        ...projects
      }
    }
  }
  allHoms{
    edges{
      cursor
      node{
        title
        intro
        links{
          link1{
            _linkType
            __typename
          }
          link2{
            _linkType
            __typename
          }
        }
        
      }
    }
  }
}
`;

type PrismicResponse = {
  projects?: Projects;
  allProjectss?: {
    edges?: Array<{
      node?: Projects;
    }>;
  }
  allHoms?: {
    edges?: Array<{
      node?: Homs;
    }>;
  }  
}

export async function getServerSideProps() {

  const result = await fetchFromPrismic<PrismicResponse>(query);
  //console.log('result :>> ', result);
  const allProjectss = result.allProjectss?.edges;
  const allHoms = result.allHoms?.edges;
  //console.log('allHoms : >> ', allHoms);
  //console.log('allHoms :>> ', allProjectss);
  return {
    props: { allProjectss, allHoms }, // will be passed to the page component as props
  }
}
