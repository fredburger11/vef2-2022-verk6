import type { GetServerSideProps, NextPage, GetStaticProps } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import { fetchFromPrismic } from '../api/prismic'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { PrismicRichText } from '@prismicio/react'
import { asText } from '@prismicio/helpers'
import { AllProjectss } from '../types';

type PrismicRichTextType = any;



export interface AllHoms {
  cursor?: string;
  node?: Node;
  
}

export interface Node {
  title?: PrismicRichTextType;
  intro?: PrismicRichTextType;
  links?: PrismicRichTextType;
}

export interface Intro {
  type?:  string;
  text?:  string;
  spans?: PrismicRichTextType[];
}

type Projects = {
  _meta?: {
    uid?: string;
  }
  title?: PrismicRichTextType;
  link?: PrismicRichTextType;
  detail?: PrismicRichTextType;
}

type homepage = {
  allHoms?: AllHoms[];
  allProjectss?: AllProjectss;
}

function Homepage({ allHoms }: homepage) {
  //console.log(JSON.stringify(allHoms))
  return (
    <ul>
      {allHoms?.map((item, i) => {
        const title = asText(item.node?.title);
        const intro = asText(item.node?.intro);
        return (
          <div key={i}>
            <h1>{title}</h1>
            <h4>{intro}</h4>
          </div> 
          
        )
      })}
    </ul>
  )
}

function Projects({ project }: { project: Array<{
  node?: Projects | undefined;
}> }) {
  console.log(JSON.stringify(project));
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

export default function Home({ allHoms, allProjectss }: homepage) {
  //console.log('allHoms : >> ', allHoms);
  //console.log('allProjects :>> ', allProjectss);
  
  return (
    <section>
      
        <Homepage allHoms={allHoms}></Homepage>
      
      <Projects project={allProjectss}></Projects>
    </section>
  )
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
      node?: Node;
    }>;
  }  
}

export async function getServerSideProps() {

  const result = await fetchFromPrismic<PrismicResponse>(query);
  //console.log('result :>> ', result);
  const allProjectss = result.allProjectss?.edges;
  const  allHoms = result.allHoms?.edges;
  //console.log('allHoms : >> ', allHoms);
  //console.log('allHoms :>> ', allProjectss);
  return {
    props: { allHoms, allProjectss }, // will be passed to the page component as props
  }
}
