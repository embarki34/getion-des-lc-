import { Request, Response, NextFunction } from 'express';
import { GenerateSwiftMT700CommandHandler } from '../../application/commands/GenerateSwiftMT700Command';
import {
  GetSwiftMessagesQuery,
  GetSwiftMessagesQueryHandler,
} from '../../application/queries/GetSwiftMessagesQuery';
import {
  GetSwiftMessageByIdQuery,
  GetSwiftMessageByIdQueryHandler,
} from '../../application/queries/GetSwiftMessageByIdQuery';
import { SwiftMessageResponseDTO } from '../../application/dto/SwiftMessageDTO';

export class SwiftController {
  constructor(
    private readonly generateMT700Handler: GenerateSwiftMT700CommandHandler,
    private readonly getSwiftMessagesHandler: GetSwiftMessagesQueryHandler,
    private readonly getSwiftMessageByIdHandler: GetSwiftMessageByIdQueryHandler
  ) {}

  async generateMT700(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Dynamic import usage left as is, verify if standard import works
      const { GenerateSwiftMT700Command } =
        await import('../../application/commands/GenerateSwiftMT700Command');
      const command = new GenerateSwiftMT700Command(req.body);
      const id = await this.generateMT700Handler.execute(command);
      res.status(201).json({ id, message: 'SWIFT MT700 generated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = new GetSwiftMessagesQuery();
      const messages = await this.getSwiftMessagesHandler.execute(query);

      const response: SwiftMessageResponseDTO[] = messages.map((msg) => this.mapToDTO(msg));

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const query = new GetSwiftMessageByIdQuery(id);
      const message = await this.getSwiftMessageByIdHandler.execute(query);

      if (!message) {
        res.status(404).json({ message: 'SWIFT message not found' });
        return;
      }

      res.status(200).json(this.mapToDTO(message));
    } catch (error) {
      next(error);
    }
  }

  private mapToDTO(message: any): SwiftMessageResponseDTO {
    return {
      id: message.id,
      type: message.type,
      content: message.content,
      referenceDossier: message.referenceDossier,
      dateGeneration: message.dateGeneration,
      statut: message.statut,
    };
  }
}
