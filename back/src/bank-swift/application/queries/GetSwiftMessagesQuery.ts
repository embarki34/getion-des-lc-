import { SwiftMessage } from '../../domain/entities/SwiftMessage';
import { SwiftMessageRepository } from '../../domain/repositories/SwiftMessageRepository';

export class GetSwiftMessagesQuery {
  // No props needed for getting all, maybe pagination later
}

export class GetSwiftMessagesQueryHandler {
  constructor(private readonly repository: SwiftMessageRepository) {}

  async execute(query: GetSwiftMessagesQuery): Promise<SwiftMessage[]> {
    return this.repository.findAll();
  }
}
