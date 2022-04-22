import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image';
import { fetchFromPrismic } from '../api/prismic';
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { PrismicImageProps, PrismicRichText, PrismicLink, PrismicLinkProps} from '@prismicio/react'
import { asText, asLink } from '@prismicio/helpers';
import { Node, Data } from '../types';

type Projects = Node;



type Props = {
  project: Projects;
}

function Links({ project }: Props) {
  
  return (
    <ul>
      {project.links?.map((item, i) => {
        //console.log(item?.spans[);
        
        const url = (item?.spans);
        const title = (item?.text);
        return (
          <li key={i}>
            <Link href={`${url}`}>
              {title}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
/*
function Links({ project }: { project: Projects | undefined; }) {
  return (
    <div>
      
        {JSON.stringify(project)}
    </div>
  )
}*/

//<img src={project?.image?.url} width={400} height={400} alt={project?.image?.alt} />
//<p>{project?.image?.alt}</p>

export default function Home({ project }: Props) {
  //console.log('allHoms : >> ', project);
  //console.log('alt :>> ', project?.image?.alt);
  return (
    <section>
      <h1>{asText(project?.title)}</h1>
      <p>{asText(project?.detail)}</p>
      
      <div>
        <Image 
          
          src={project?.image?.url}
          alt={project?.image?.alt}
          width="400"
          height="200"

        />
      </div>
      <h3>{asText(project?.linktitle)}</h3>
      <div>
        <Links project={project}></Links>
      </div>
      <div>
        <Link href="/">
          <a>Aftur á upphafssíðu</a>
        </Link>
      </div>
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
}

export async function getServerSideProps({ params }: any) {

  const { uid } = params;

  const result = await fetchFromPrismic<PrismicResponse>(query, { uid });

  //console.log('result :>> ', result);
  
  const project = result.projects ?? null;

  //console.log('project :>> ', project);
  
  if(!project) {
    return {
      notFound: true,
      props: {},
    };
  }
  return {
    props: { project }, // will be passed to the page component as props
  }
}
