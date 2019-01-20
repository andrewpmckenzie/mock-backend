import {Observable} from 'rxjs';
import {AddDocumentEvent, DocumentEvent, RemoveDocumentEvent, UpdateDocumentEvent} from './Event';
import {AbstractField} from './Field';
import {DocumentId} from './Id';
import {Schema} from './Schema';

export interface Collection<RawDocumentType = {}> {
  readonly additions: Observable<AddDocumentEvent<RawDocumentType>>;
  readonly removals: Observable<RemoveDocumentEvent<RawDocumentType>>;
  readonly updates: Observable<UpdateDocumentEvent<RawDocumentType>>;

  readonly events: Observable<DocumentEvent<RawDocumentType>>;

  readonly schema: Schema<RawDocumentType>;

  add(id: DocumentId, document: RawDocumentType): Readonly<RawDocumentType>;
  update<ValueType>(id: DocumentId, field: AbstractField<RawDocumentType, string, ValueType>, value: ValueType):
      Readonly<RawDocumentType> | null;
  get(id: DocumentId): Readonly<RawDocumentType> | null;
  remove(id: DocumentId): Readonly<RawDocumentType> | null;
  size(): number;

  getAll(): ReadonlyArray<Readonly<RawDocumentType>>;
  getMap(): ReadonlyMap<DocumentId, Readonly<RawDocumentType>>;

  serialize(): string;
  deserialize(serialized: string): void;
}

export interface Singleton<RawDocumentType> {
  readonly updates: Observable<UpdateDocumentEvent<RawDocumentType>>;

  readonly events: Observable<DocumentEvent<RawDocumentType>>;

  readonly schema: Schema<RawDocumentType>;
  value: Readonly<RawDocumentType>;

  update<ValueType>(field: AbstractField<RawDocumentType, string, ValueType>, value: ValueType):
      Readonly<RawDocumentType>;

  serialize(): string;
  deserialize(serialized: string): void;
}
