import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { SwiftMessageRepository } from '../../domain/repositories/SwiftMessageRepository';
import { SwiftMessage, SwiftMessageType } from '../../domain/entities/SwiftMessage';

export class PrismaSwiftMessageRepository implements SwiftMessageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(message: SwiftMessage): Promise<void> {
    const props = message['props'];

    await this.prisma.swiftMessage.upsert({
      where: { id: message.id },
      create: {
        id: message.id,
        type: props.type,
        content: props.content,
        referenceDossier: props.referenceDossier,
        dateGeneration: props.dateGeneration,
        statut: props.statut,
      },
      update: {
        statut: props.statut,
        content: props.content,
      },
    });
  }

  async findById(id: string): Promise<SwiftMessage | null> {
    const record = await this.prisma.swiftMessage.findUnique({
      where: { id },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByReference(reference: string): Promise<SwiftMessage[]> {
    const records = await this.prisma.swiftMessage.findMany({
      where: { referenceDossier: reference },
    });

    return records.map((r) => this.toDomain(r));
  }

  async findAll(): Promise<SwiftMessage[]> {
    const records = await this.prisma.swiftMessage.findMany({
      orderBy: { dateGeneration: 'desc' },
    });

    return records.map((r) => this.toDomain(r));
  }

  private toDomain(record: any): SwiftMessage {
    return SwiftMessage.create(
      {
        type: record.type as SwiftMessageType,
        content: record.content,
        referenceDossier: record.referenceDossier,
        dateGeneration: record.dateGeneration,
        statut: record.statut,
      },
      record.id
    );
  }
}
