import { SignInButton } from '../SignInButton';
import { ActiveLink } from '../../components/ActiveLink';

import styles from './styles.module.scss';

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <ActiveLink activeClassName={styles.active} href="/">
                        <a>home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active}  href="/posts">
                        <a>posts</a>
                    </ActiveLink>
                </nav>
                <SignInButton />
            </div>
        </header>
    );
}