import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: 'USER' | 'ADMIN'
      role: 'ADMIN' | 'CUSTOMER'
    }
  }
}
