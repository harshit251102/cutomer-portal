import React from 'react';
import styled from 'styled-components';
import { Customer } from '../types/Customer';

interface CustomerCardProps {
  customer: Customer;
  isSelected: boolean;
  onClick: () => void;
}

const Card = styled.div<{ isSelected: boolean }>`
  padding: 10px;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? '#f0f0f0' : '#fff')};
  border-left: ${({ isSelected }) => (isSelected ? '4px solid #007BFF' : 'none')};
  &:hover {
    background-color: #f8f8f8;
  }
`;

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, isSelected, onClick }) => (
  <Card isSelected={isSelected} onClick={onClick}>
    <h3>{customer.name}</h3>
    <p>{customer.title}</p>
  </Card>
);

export default CustomerCard;
