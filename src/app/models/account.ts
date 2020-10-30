import { changeHistory } from './changeHistory';

export interface account{
    user: string,
    pwd: string,
    strength: number,
    showPwd: boolean,
    notify: boolean,
    lastUpdate: string, 
    created: string,
    refresh: boolean,
    interval: number,
    history: changeHistory[]
}