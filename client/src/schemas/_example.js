import { schema } from 'normalizr';

export const exampleSchema = new schema.Entity('examples', {});
export const exampleListSchema = [exampleSchema];
