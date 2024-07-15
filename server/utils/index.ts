import { createHmac } from 'crypto';

export const hashPassword = (password?: string | null) => {
  if (password) {
    return createHmac('sha256', process.env.AUTH_SECRET || 'default-secret')
      .update(password)
      .digest('hex');
  }

  return '';
};
