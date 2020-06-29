import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

export const folder = path.resolve(__dirname, '..', '..', 'temp');

export default {
  storage: multer.diskStorage({
    destination: folder,
    filename(req, file, cb) {
      const filehash = crypto.randomBytes(5).toString('HEX');
      const fileName = `${filehash}-${file.originalname}`;
      return cb(null, fileName);
    },
  }),
};
