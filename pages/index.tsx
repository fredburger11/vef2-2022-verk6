import { fetchFromPrismic } from '../api/prismic';
import Link from 'next/link';
import { asText } from '@prismicio/helpers';
import { AllProjectss, Node } from '../types/projecttypes';
import { AllHoms } from '../types/homeptypes';

type Projects = Node;


type homepage = {
  allHoms?: AllHoms[];
  allProjectss?: AllProjectss[];
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

function Projects({ allProjectss }: { allProjectss: Array<{
  node?: Projects;
}> }) {
  return (
    <ul>
      {allProjectss.map((item, i) => {
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
  return (
    <section> 
      <Homepage allHoms={allHoms}></Homepage>
      <Projects allProjectss={allProjectss}></Projects>
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
  const allProjectss = result.allProjectss?.edges;
  const  allHoms = result.allHoms?.edges;
  
  return {
    props: { allHoms, allProjectss }, // will be passed to the page component as props
  }
}
