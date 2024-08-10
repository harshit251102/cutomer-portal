import React from 'react';
import styled from 'styled-components';
import { Customer } from '../types/Customer';
import PhotoGrid from './PhotoGrid';

interface CustomerDetailsProps {
    customer: Customer;
}

const DetailsWrapper = styled.div`
  padding: 20px;
  align-items: center;
`;


const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer }) => (
    <DetailsWrapper>
        <h2 style={{ 'textAlign': 'center' }}>{customer.name}</h2>
        <h4 style={{ 'textAlign': 'center' }}>{customer.title}</h4>
        <p>{customer.address}</p>
        <PhotoGrid customerId={customer.id} />
    </DetailsWrapper>
);

export default CustomerDetails;
