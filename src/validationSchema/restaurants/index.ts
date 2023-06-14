import * as yup from 'yup';
import { menuValidationSchema } from 'validationSchema/menus';
import { tableLayoutValidationSchema } from 'validationSchema/table-layouts';

export const restaurantValidationSchema = yup.object().shape({
  address: yup.string(),
  phone_number: yup.string(),
  email: yup.string(),
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  menu: yup.array().of(menuValidationSchema),
  table_layout: yup.array().of(tableLayoutValidationSchema),
});
