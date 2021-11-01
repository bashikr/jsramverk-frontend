export interface UpdateDoc {
  '_id': string,
  'title'?: string,
  'content'?: string,
  'creationDate'?: Date | null,
  'updateDate'?: Date
}


export interface CreateDoc {
  'title'?: string,
  'content'?: string,
  'creationDate'?: Date
}

export interface DeleteDoc {
  'id': string,
}


export interface DisplayDoc {
  '_id': string,
  'title'?: string,
  'content'?: string,
  'creationDate'?: Date,
  'updateDate'?: Date
}
