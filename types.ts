type PrismicRichTextType = any;

export interface AllProjectss {
    node?: Node;
}

export interface Projects {
    projects?: Projects[];
}

export interface Node {
    _meta?:     Meta;
    title?:     PrismicRichTextType;
    link?:      Link;
    detail?:    PrismicRichTextType;
    image?:     Image;
    linktitle?: PrismicRichTextType;
    links?:     Detail[];
}

export interface Meta {
    uid?: string;
}

export interface Detail {
    type?:  string;
    text?:  string;
    spans?: PrismicRichTextType[];
}

export interface Span {
    start?: number;
    end?:   number;
    type?:  string;
    data?:  Data;
}

export interface Data {
    link_type?: string;
    url?:       string;
}

export interface Image {
    dimensions?: Dimensions;
    alt?:        string;
    copyright?:  null;
    url?:        string;
}

export interface Dimensions {
    width?:  number;
    height?: number;
}

export interface Link {
    _linkType?:  string;
    __typename?: string;
}