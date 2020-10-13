import { account } from './account';

export interface password{
    category: number,
    label: string,
    website: string,
    accounts: account[]
}