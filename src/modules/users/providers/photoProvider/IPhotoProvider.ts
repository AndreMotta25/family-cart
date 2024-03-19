export interface ISaveFile {
  name: string;
  cid: string;
}

interface IPhotoProvider {
  saveFile(file: string): Promise<ISaveFile>;
  deleteFile(file: string): Promise<void>;
}
export { IPhotoProvider };
