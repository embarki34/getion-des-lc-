import { SwiftMessage } from '../../domain/entities/SwiftMessage';
import { SwiftMessageRepository } from '../../domain/repositories/SwiftMessageRepository';

export class GetSwiftMessageByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetSwiftMessageByIdQueryHandler {
  constructor(private readonly repository: SwiftMessageRepository) {}

  async execute(query: GetSwiftMessageByIdQuery): Promise<SwiftMessage | null> {
    return this.repository.findById(query.id);
  }
}
