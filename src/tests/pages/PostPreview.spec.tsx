import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';


jest.mock('../../services/prismic');
jest.mock('next-auth/client');
jest.mock('next/router');

const getPrismicClientMocked = mocked(getPrismicClient);
const useSessionMocked = mocked(useSession);
const userRouterMocked = mocked(useRouter);

const post = {
    slug: 'my-new-post',
    title: 'My new post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de abril'
};

describe('Home page', () => {
    it('renders correctly', () => {
        useSessionMocked.mockReturnValueOnce([null, false]);
        render(<Post post={post}  />)

        expect(screen.getByText('My new post')).toBeInTheDocument();
        expect(screen.getByText('Post excerpt')).toBeInTheDocument();
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    });

    it('redirects user to full post when use is subscribed', async () => {
        const pushMock = jest.fn();
        useSessionMocked.mockReturnValueOnce([
            {
                activeSubscription: 'fake-active-subscription'
            },
            false
        ]);

        userRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any);

        render(<Post post={post}  />)

        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
    });

    // it('loads initial data', async () => {
    //     getSessionMock.mockResolvedValueOnce({
    //         activeSubscription: 'fake-active-subscription'
    //     } as any);
    //     getPrismicClientMocked.mockReturnValueOnce({
    //         getByUID: jest.fn().mockResolvedValueOnce({
    //             data: {
    //                 title: [
    //                     { type: 'heading', text: 'My new post' },
    //                 ],
    //                 content:[
    //                     {type: 'paragraph', text: 'Post content'},
    //                 ]
    //             },
    //             last_publication_date: '04-04-2021'
    //         }),
    //     } as any);


    //     const response = await getServerSideProps({
    //         params: { slug: 'my-new-post' }
    //     } as any);

    //     expect(response).toEqual(expect.objectContaining({
    //         props: {
    //             post: {
    //                 slug: 'my-new-post',
    //                 title: 'My new post',
    //                 content: '<p>Post content</p>',
    //                 updatedAt: '04 de abril de 2021'
    //             }
    //         }
    //     }))
    // });
});