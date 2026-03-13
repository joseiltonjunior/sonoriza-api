import { Injectable } from '@nestjs/common'

import { AccountVerification } from '@/domain/users/entities/account-verification'
import { AccountVerificationRepository } from '@/domain/users/repositories/account-verification-repository'
import { PrismaAccountVerificationMapper } from './mappers/prisma-account-verification.mapper'
import { PrismaService } from './prisma.service'

@Injectable()
export class PrismaAccountVerificationRepository implements AccountVerificationRepository {
  constructor(private prisma: PrismaService) {}

  async create(accountVerification: AccountVerification): Promise<void> {
    await this.prisma.accountVerification.create({
      data: PrismaAccountVerificationMapper.toPrisma(accountVerification),
    })
  }

  async findLatestPendingByUserId(
    userId: string,
  ): Promise<AccountVerification | null> {
    const verification = await this.prisma.accountVerification.findFirst({
      where: {
        userId,
        verifiedAt: null,
        revokedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!verification) {
      return null
    }

    return PrismaAccountVerificationMapper.toDomain(verification)
  }

  async update(accountVerification: AccountVerification): Promise<void> {
    await this.prisma.accountVerification.update({
      where: { id: accountVerification.id },
      data: PrismaAccountVerificationMapper.toPrisma(accountVerification),
    })
  }
}
