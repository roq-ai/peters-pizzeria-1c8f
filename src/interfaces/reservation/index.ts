import { UserInterface } from 'interfaces/user';
import { TableLayoutInterface } from 'interfaces/table-layout';
import { GetQueryInterface } from 'interfaces';

export interface ReservationInterface {
  id?: string;
  date: any;
  time: any;
  number_of_guests: number;
  customer_id: string;
  table_layout_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  table_layout?: TableLayoutInterface;
  _count?: {};
}

export interface ReservationGetQueryInterface extends GetQueryInterface {
  id?: string;
  customer_id?: string;
  table_layout_id?: string;
}
