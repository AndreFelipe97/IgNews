import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';


jest.mock('../../services/prismic');
jest.mock('next-auth/client');

const getPrismicClientMocked = mocked(getPrismicClient);
const getSessionMock = mocked(getSession);

const post = {
    slug: 'my-new-post',
    title: 'My new post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de abril'
};

describe('Home page', () => {
    it('renders correctly', () => {
        render(<Post post={post}  />)

        expect(screen.getByText('My new post')).toBeInTheDocument();
        expect(screen.getByText('Post excerpt')).toBeInTheDocument();
    });

    it('redirects user if no subscription is found', async () => {
        // getPrismicClientMocked.mockReturnValueOnce({
        //     query: jest.fn().mockResolvedValueOnce({
        //         results: [{
        //             uid: 'my-new-post',
        //             data: {
        //                 title: [
        //                     { type: 'heading', text: 'My new post' },
        //                 ],
        //                 content:[
        //                     {type: 'paragraph', text: 'Post excerpt'},
        //                 ]
        //             },
        //             last_publication_date: '04-04-2021'
        //         }]
        //     })
        // } as any);
        
        getSessionMock.mockResolvedValueOnce({
            activeSubscription: null
        } as any);

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            }
        } as any);

        expect(response).toEqual(expect.objectContaining({
            redirect: expect.objectContaining({
                destination: '/'
            })
        }))
    });

    it('loads initial data', async () => {
        getSessionMock.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any);
        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'My new post' },
                    ],
                    content:[
                        {type: 'paragraph', text: 'Post content'},
                    ]
                },
                last_publication_date: '04-04-2021'
            }),
        } as any);


        const response = await getServerSideProps({
            params: { slug: 'my-new-post' }
        } as any);

        expect(response).toEqual(expect.objectContaining({
            props: {
                post: {
                    slug: 'my-new-post',
                    title: 'My new post',
                    content: '<p>Post content</p>',
                    updatedAt: '04 de abril de 2021'
                }
            }
        }))
    });
});