import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createTableLayout } from 'apiSdk/table-layouts';
import { Error } from 'components/error';
import { tableLayoutValidationSchema } from 'validationSchema/table-layouts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RestaurantInterface } from 'interfaces/restaurant';
import { getRestaurants } from 'apiSdk/restaurants';
import { TableLayoutInterface } from 'interfaces/table-layout';

function TableLayoutCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TableLayoutInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTableLayout(values);
      resetForm();
      router.push('/table-layouts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TableLayoutInterface>({
    initialValues: {
      layout_name: '',
      capacity: 0,
      restaurant_id: (router.query.restaurant_id as string) ?? null,
    },
    validationSchema: tableLayoutValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Table Layout
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="layout_name" mb="4" isInvalid={!!formik.errors?.layout_name}>
            <FormLabel>Layout Name</FormLabel>
            <Input type="text" name="layout_name" value={formik.values?.layout_name} onChange={formik.handleChange} />
            {formik.errors.layout_name && <FormErrorMessage>{formik.errors?.layout_name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="capacity" mb="4" isInvalid={!!formik.errors?.capacity}>
            <FormLabel>Capacity</FormLabel>
            <NumberInput
              name="capacity"
              value={formik.values?.capacity}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('capacity', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.capacity && <FormErrorMessage>{formik.errors?.capacity}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<RestaurantInterface>
            formik={formik}
            name={'restaurant_id'}
            label={'Select Restaurant'}
            placeholder={'Select Restaurant'}
            fetcher={getRestaurants}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'table_layout',
  operation: AccessOperationEnum.CREATE,
})(TableLayoutCreatePage);
