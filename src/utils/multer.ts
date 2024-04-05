import crypto from 'crypto';
import multer from 'multer';
import { resolve } from 'path';

// Configuração do armazenamento
const generateFileName = (file: Express.Multer.File) => {
  const fileHash = crypto.randomBytes(10).toString('hex');
  const fileName = `${fileHash}-${file.originalname}`;

  return fileName;
};

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  const allowedMimes = ['image/jpeg', 'image/png'];

  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    // talvez isso tenha que ser revisto porque pode ser obrigatorio ter um retorno false aqui.
    callback(new Error('Invalid file type.'));
  }
};

const storage = multer.diskStorage({
  destination: resolve(__dirname, '..', '..', 'tmp', 'avatar'),
  filename: (req, file, callback) => {
    callback(null, generateFileName(file));
  },
});

// Opções de upload
const upload = multer({ storage, fileFilter });

export { upload };
