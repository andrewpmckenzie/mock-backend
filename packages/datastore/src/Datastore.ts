import {merge, Observable, Subject} from 'rxjs';
import {ConcreteCollection} from './ConcreteCollection';
import {ConcreteSingleton} from './ConcreteSingleton';
import {AddCollectionEvent, AddSingletonEvent, Collection, Event, Schema, Singleton} from './interface';

export class Datastore {
  public readonly addedSingleton: Observable<AddSingletonEvent>;
  public readonly addedCollection: Observable<AddCollectionEvent>;
  public readonly events: Observable<Event>;

  private addedSingletonSubject = new Subject<AddSingletonEvent>();
  private addedCollectionSubject = new Subject<AddCollectionEvent>();
  private eventsSubject = new Subject<Event>();

  private collections = new Map<string, Collection>();
  private singletons = new Map<string, Singleton>();

  constructor() {
    this.addedSingleton = this.addedSingletonSubject.asObservable();
    this.addedCollection = this.addedCollectionSubject.asObservable();
    this.events = merge(this.addedSingleton, this.addedCollection, this.eventsSubject.asObservable());
  }

  public getCollections(): ReadonlyMap<string, Collection> {
    return this.collections;
  }

  public getSingletons(): ReadonlyMap<string, Singleton> {
    return this.singletons;
  }

  public createCollection<RawDocumentType>(schema: Schema<RawDocumentType>): Collection<RawDocumentType> {
    if (this.collections.has(schema.name)) {
      throw new Error(`A collection called ${schema.name} already exists.`);
    }
    const collection = new ConcreteCollection<RawDocumentType>(schema);
    this.collections.set(schema.name, collection);
    collection.events.subscribe((e) => this.eventsSubject.next(e));
    this.addedCollectionSubject.next({eventType: 'AddCollectionEvent', collection});
    return collection;
  }

  public createSingleton<RawDocumentType>(schema: Schema<RawDocumentType>): Singleton<RawDocumentType> {
    if (this.singletons.has(schema.name)) {
      throw new Error(`A singleton called ${schema.name} already exists.`);
    }
    const singleton = new ConcreteSingleton<RawDocumentType>(schema);
    this.singletons.set(schema.name, singleton);
    singleton.events.subscribe((e) => this.eventsSubject.next(e));
    this.addedSingletonSubject.next({eventType: 'AddSingletonEvent', singleton});
    return singleton;
  }
}
