export default EventEmitter;
export class EventEmitter {
    on(names: string, callback: () => void);
    off(names: string);
    trigger(names: string);
}