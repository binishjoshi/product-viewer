import jwt from 'jsonwebtoken';
import config from 'config';

const privateKey = config.get<string>('privateKey');
const publicKey = config.get<string>('publicKey');

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    // algorithm: 'RS256',
  });
}

export function verifyJwt(token: string) {
  try {
    const decodedToken = jwt.verify(token, privateKey);
    return {
      valid: true,
      expired: false,
      decoded: decodedToken,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    };
  }
}
