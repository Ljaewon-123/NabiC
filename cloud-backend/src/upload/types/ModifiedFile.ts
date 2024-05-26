export interface ModifiedFile  {
  id?: number
  userId : number

  directory?: string[],

  fileName : string
  file : Buffer
  fileType : string
  size: number

  lastModified :string 
  lastModifiedDate :string
}