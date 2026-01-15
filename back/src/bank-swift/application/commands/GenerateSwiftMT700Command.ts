import {
  ICommand,
  ICommandHandler,
} from "../../../shared/application/ICommand";
import { SwiftMessageRepository } from "../../domain/repositories/SwiftMessageRepository";
import {
  SwiftMessage,
  SwiftMessageType,
} from "../../domain/entities/SwiftMessage";
import { SwiftMT700Generator } from "../../infrastructure/swift/SwiftMT700Generator";
import { SwiftMT700DTO } from "../dto/SwiftMessageDTO";

export class GenerateSwiftMT700Command implements ICommand {
  constructor(public readonly data: SwiftMT700DTO) {}
}

export class GenerateSwiftMT700CommandHandler
  implements ICommandHandler<GenerateSwiftMT700Command, string>
{
  constructor(
    private readonly repository: SwiftMessageRepository,
    private readonly generator: SwiftMT700Generator
  ) {}

  async execute(command: GenerateSwiftMT700Command): Promise<string> {
    const content = this.generator.generate(command.data);

    const swiftMessage = SwiftMessage.create({
      type: SwiftMessageType.MT700,
      content,
      referenceDossier: command.data.referenceDossier,
      dateGeneration: new Date(),
      statut: "GENERATED",
    });

    await this.repository.save(swiftMessage);

    return swiftMessage.id;
  }
}
