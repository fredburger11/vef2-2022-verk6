type PrismicRichTextType = any;

export interface AllHoms {
    allHoms?: AllHoms[];
}

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