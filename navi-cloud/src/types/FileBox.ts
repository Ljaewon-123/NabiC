export interface File {
  fileName: string
  fileType:  string
  file: { data: Buffer }
  id: number
  lastModified:  string
  lastModifiedDate:  string
  size: number
}
export interface Folder{
  id: number
  depth: number
  folderName: string
}


