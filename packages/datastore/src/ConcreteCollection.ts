import {merge, Observable, Subject} from 'rxjs';
import {
  AbstractField,
  AddDocumentEvent,
  Collection,
  DocumentEvent,
  DocumentId,
  RemoveDocumentEvent,
  Schema,
  UpdateDocumentEvent,
} from './interface';

export class ConcreteCollection<RawDocumentType> implements Collection<RawDocumentType> {
  public readonly additions: Observable<AddDocumentEvent<RawDocumentType>>;
  public readonly removals: Observable<RemoveDocumentEvent<RawDocumentType>>;
  public readonly updates: Observable<UpdateDocumentEvent<RawDocumentType>>;
  public readonly events: Observable<DocumentEvent<RawDocumentType>>;

  private readonly additionsSubject = new Subject<AddDocumentEvent<RawDocumentType>>();
  private readonly removalsSubject = new Subject<RemoveDocumentEvent<RawDocumentType>>();
  private readonly updatesSubject = new Subject<UpdateDocumentEvent<RawDocumentType>>();

  private documents = new Map<DocumentId, Readonly<RawDocumentType>>();

  public constructor(readonly schema: Schema<RawDocumentType>) {
    this.additions = this.additionsSubject.asObservable();
    this.removals = this.removalsSubject.asObservable();
    this.updates = this.updatesSubject.asObservable();
    this.events = merge(this.additions, this.removals, this.updates);
  }

  public add(id: DocumentId, document: RawDocumentType): Readonly<RawDocumentType> {
    const isUpdate = this.documents.has(id);
    this.documents.set(id, document);
    if (isUpdate) {
      this.updatesSubject.next({document, eventType: 'UpdateDocumentEvent', id});
    } else {
      this.additionsSubject.next({document, eventType: 'AddDocumentEvent', id});
    }
    return document;
  }

  public update<ValueType>(
      id: DocumentId,
      field: AbstractField<RawDocumentType, string, ValueType>,
      value: ValueType,
  ): Readonly<RawDocumentType> | null {
    const document = this.get(id);
    if (document == null) {
      return document;
    }

    const updatedDocument = field.updateDocument(document, value);
    this.add(id, updatedDocument);
    return updatedDocument;
  }

  public get(id: DocumentId): Readonly<RawDocumentType> | null {
    return this.documents.get(id) || null;
  }

  public getAll(): ReadonlyArray<Readonly<RawDocumentType>> {
    return [...this.documents.values()];
  }

  public getMap(): ReadonlyMap<DocumentId, Readonly<RawDocumentType>> {
    return this.documents;
  }

  public remove(id: DocumentId): Readonly<RawDocumentType> | null {
    const document = this.documents.get(id);
    if (!document) {
      return null;
    }
    this.documents.delete(id);
    this.removalsSubject.next({document, eventType: 'RemoveDocumentEvent', id});
    return document;
  }

  public size() {
    return this.documents.size;
  }

  public serialize(): string {
    const serializedArray = [...this.documents].map(([k, v]) => [k, this.schema.serialize(v)]);
    return JSON.stringify(serializedArray);
  }

  public deserialize(serialized: string) {
    if (this.size() > 0) {
      throw new Error(`Attempted to deserialize ${this.schema.name} when it already contains documents.`);
    }

    try {
      const serializedArray = JSON.parse(serialized);
      const deserializedArray = serializedArray.map(([k, v]: [DocumentId, string]) => [k, this.schema.deserialize(v)]);
      this.documents = new Map(deserializedArray);
    } catch (e) {
      throw new Error(`Could not deserialize collection ${this.schema.name}: ${e.message}`);
    }
  }
}
