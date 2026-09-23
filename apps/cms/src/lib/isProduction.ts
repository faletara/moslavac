/** Jedini izvor istine za "produkciju" (admin originsi, `Secure` auth cookie). */
export const isProduction = (env: { NODE_ENV?: string }): boolean =>
  env.NODE_ENV === 'production'
