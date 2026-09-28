import type { TListItem } from '@rtbnext/schema/src/model/list';

import type { CollectItem } from '../types/collection';
import type { ListEndpoint, ListSnapshot } from '../types/endpoint';
import { sanitize, ymd } from '../utils';
import { Endpoint } from './Endpoint';
import { useProfile } from './Profile';


/**
 * Endpoint implementation for list resources.
 * 
 * Provides access to item snapshots, date-indexed list resources, and the list index.
 */
export class List extends Endpoint implements ListEndpoint {}
