interface Observable {
    observers: Array<Observer>;
    subscribe(o: Observer): void;
    unsubscribe(): void;
}