import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SubscribeButton } from '../../components/SubscribeButton';

jest.mock('next-auth/client');

jest.mock('next/router')

const useSessionMocked = mocked(useSession);
const signInMocked = mocked(signIn);
const useRouterMock = mocked(useRouter);

describe('SubscribeButton component', () => {
    it('renders correctly', () => {
        useSessionMocked.mockReturnValueOnce([null, false]);
        render(
            <SubscribeButton />
        );

        expect(screen.getByText('Subscribe now')).toBeInTheDocument();
    });

    it('redirects user to sign in when not authenticated', () => {
        useSessionMocked.mockReturnValueOnce([null, false]);
        render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled();
    });

    it('redirects to posts when user already has a subscription', () => {
        useSessionMocked.mockReturnValueOnce([
            { user: {
                name: "André Felipe",
                email: 'andrefeliperf17@gmail.com'
            },
            activeSubscription: 'fake-subscription', 
            expires: 'fake-expires'},
            false
        ]);


        const pushMock = jest.fn();

        useRouterMock.mockReturnValueOnce({
            push: pushMock,
        } as any);

        render(
            <SubscribeButton />
        );
        const subscribeButton = screen.getByText('Subscribe now');
        fireEvent.click(subscribeButton);
        expect(pushMock).toHaveBeenCalledWith('/posts')
    })
});