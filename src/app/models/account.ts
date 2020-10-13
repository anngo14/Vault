import { changeHistory } from './changeHistory';

export interface account{
    user: string,
    pwd: string,
    strength: number,
    notify: boolean,
    created: string,
    refresh: boolean,
    interval: number
    history: changeHistory[]
}