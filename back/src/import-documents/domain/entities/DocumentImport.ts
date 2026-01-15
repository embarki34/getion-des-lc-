import { Entity } from "../../../shared/domain/ddd";

export interface DocumentImportProps {
  type: "PRO_FORMA" | "FACTURE" | "BL" | "AUTRE";
  nomFichier: string;
  cheminFichier: string; // Path or URL
  dateUpload: Date;
  metadata?: Record<string, any>; // Extracted metadata
  referenceDossier: string; // Linked to LC or other dossier
}

export class DocumentImport extends Entity<DocumentImportProps> {
  private constructor(props: DocumentImportProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: DocumentImportProps,
    id?: string
  ): DocumentImport {
    return new DocumentImport(props, id);
  }

  get type(): string {
    return this.props.type;
  }
  get url(): string {
    return this.props.cheminFichier;
  }
}
