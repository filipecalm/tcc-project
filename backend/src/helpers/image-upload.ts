import multer from 'multer';
import path from 'path';
import MESSAGE from '../constants/messages';

import { Request } from 'express';

const Storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    let folder = '';

    if (req.baseUrl.includes('product')) {
      folder = 'product';
    }

    cb(null, `public/images/${folder}`);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(
      null,
      Date.now() + 
        String(Math.floor(Math.random() * 1000)) +
        path.extname(file.originalname)
    );
  }
});

const imageUpload = multer({
  storage: Storage,
  fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error(MESSAGE.ERROR.UPLOAD_ERROR));
    }
    cb(null, true);
  }
});

export { imageUpload };
