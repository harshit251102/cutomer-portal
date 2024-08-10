import React, { useState } from 'react';
import styled from 'styled-components';
import CustomerCard from '../components/CustomerCard';
import CustomerDetails from '../components/CustomerDetails';
import { Customer } from '../types/Customer';

const generateCustomers = (count: number): Customer[] => {
    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        name: `Customer ${index + 1}`,
        title: `Title ${index + 1}`,
        address: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.',
    }));
};

const customers: Customer[] = generateCustomers(1000);

const PortalWrapper = styled.div`
  display: flex;
  height: calc(100vh - 70px);
`;

const CustomerList = styled.div`
  width: 300px;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #ddd;
  border-top: 1px solid #ddd;
`;

const CustomerDetailsWrapper = styled.div`
  flex: 1;
  padding: 20px;
`;

const CustomerPortal: React.FC = () => {
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

    const selectedCustomer = customers.find(customer => customer.id === selectedCustomerId);

    return (
        <>
            <h1 style={{ 'textAlign': 'center' }}>Cube - React Assignment - Customer Portal</h1>
            <PortalWrapper>
                <CustomerList>
                    {customers.map(customer => (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            isSelected={customer.id === selectedCustomerId}
                            onClick={() => setSelectedCustomerId(customer.id)}
                        />
                    ))}
                </CustomerList>
                <CustomerDetailsWrapper>
                    {selectedCustomer ? (
                        <CustomerDetails customer={selectedCustomer} />
                    ) : (
                        <p>Select a customer to view details</p>
                    )}
                </CustomerDetailsWrapper>
            </PortalWrapper>
        </>
    );
};

export default CustomerPortal;
