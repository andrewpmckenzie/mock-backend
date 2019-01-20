export type SupportedType = 'string' | 'number' | 'boolean';

export interface AbstractField<RawDocumentType, TypeId, TypescriptType> {
  readonly type: TypeId & SupportedType;
  readonly displayName: string;
  updateDocument(document: Readonly<RawDocumentType>, value: TypescriptType): Readonly<RawDocumentType>;
}

export interface StringField<RawDocumentType> extends AbstractField<RawDocumentType, 'string', string> {
  type: 'string';
}

export interface NumberField<RawDocumentType> extends AbstractField<RawDocumentType, 'number', number> {
  type: 'number';
}

export interface BooleanField<RawDocumentType> extends AbstractField<RawDocumentType, 'boolean', boolean> {
  type: 'boolean';
}

export type Field<RawDocumentType> =
    StringField<RawDocumentType> | NumberField<RawDocumentType> | BooleanField<RawDocumentType>;
