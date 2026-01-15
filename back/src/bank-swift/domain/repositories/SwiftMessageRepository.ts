import { SwiftMessage } from '../entities/SwiftMessage';

export interface SwiftMessageRepository {
  save(message: SwiftMessage): Promise<void>;
  findById(id: string): Promise<SwiftMessage | null>;
  findByReference(reference: string): Promise<SwiftMessage[]>;
  findAll(): Promise<SwiftMessage[]>;
}
