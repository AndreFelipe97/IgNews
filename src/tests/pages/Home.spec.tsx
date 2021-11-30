import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { stripe } from '../../services/stripe';
import { mocked } from 'ts-jest/utils';
import Home, { getStaticProps } from '../../pages';

jest.mock('next/router');
jest.mock('next-auth/client');
jest.mock('../../services/stripe');

const useSessionMocked = mocked(useSession);
const retriveStripePricesMocked = mocked(stripe.prices.retrieve);

const product = {
    priceId: 'fake-price-id',
    amount: 'R$10,00'
}

describe('Home page', () => {
    it('renders correctly', () => {
        useSessionMocked.mockReturnValueOnce([null, false]);
        render(<Home product={product}  />)

        expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
    });

    it('loads initial data', async () => {
        retriveStripePricesMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000,
        } as any);

        const response = await getStaticProps({});

        expect(response).toEqual(expect.objectContaining({
            props: {
                product: {
                    priceId: 'fake-price-id',
                    amount: '$10.00'
                }
            }
        }))
    });
});