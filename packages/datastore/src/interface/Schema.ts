import {Field} from './Field';

export interface Schema<RawDocumentType> {
  readonly name: string;
  readonly fields: Array<Field<RawDocumentType>>;

  create(): RawDocumentType;
  serialize(document: RawDocumentType): string;
  deserialize(document: string): Readonly<RawDocumentType>;
}
