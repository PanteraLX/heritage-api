import { IPerson } from './person';

export interface IFamily extends IPerson {
    children?: IFamily[];
    parents?: IFamily[];
    partners?: IFamily[];
}
