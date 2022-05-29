import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from '../../components/shared/spinner'
import { useAuth } from '../../lib/providers/auth-provider'
import { ROLE } from '../../lib/type'
import { DefaultHead } from '../default-head'
import { Footer } from './components/footer'
import { Header } from './components/header'

export function DefaultLayout({ ...props }) {
    const { user, redirectToLoginPage, userGetMe, redirectToAdminPage } = useAuth()
    const router = useRouter()
    useEffect(() => {
        if (user === undefined) {
            userGetMe()
        } else if (user === null) {
            redirectToLoginPage()
        }
    }, [user])
    if (user === undefined) return <Spinner />
    return (
        <div className="w-full">
            <DefaultHead />
            <NextSeo defaultTitle={'N17DCAT009'} title={props.title ? props.title : ''} />
            <Header />
            <div
                className="w-full h-full flex flex-col"
                style={{ minHeight: 'calc(100vh - 96px)' }}
            >
                {props.children}
            </div>
            <Footer />
        </div>
    )
}
