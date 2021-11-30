import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import { SignInButton } from '../../components/SignInButton';

jest.mock('next-auth/client');
const useSessionMocked = mocked(useSession);

describe('SignInButton component', () => {
    it('renders correctly when is not authenticated', () => {
        useSessionMocked.mockReturnValueOnce([null, false])

        render(
            <SignInButton />
        );

        expect(screen.getByText('Sign in with github')).toBeInTheDocument();
    });

    it('renders correctly when is authenticated', () => {
        useSessionMocked.mockReturnValueOnce([
            { user: {
                name: "André Felipe",
                email: 'andrefeliperf17@gmail.com'
            }, expires: 'fake-expires'},
            false
        ])
        render(
            <SignInButton />
        );

        expect(screen.getByText('André Felipe')).toBeInTheDocument();
    });
});