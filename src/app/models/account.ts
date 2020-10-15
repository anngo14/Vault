import { changeHistory } from './changeHistory';

export interface account{
    user: string,
    pwd: string,
    strength: number,
    showPwd: boolean,
    notify: boolean,
    created: string,
    refresh: boolean,
    interval: number
    history: changeHistory[]
}