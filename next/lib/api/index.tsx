import axios from 'axios'
import { getTokenAdmin } from './header'

export type HeaderType = {}
export type BodyType = {}
export type METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE'
export interface TypeProps {
    method: METHOD
    url: String
    header?: HeaderType
    body?: BodyType
    params?: any
}

export async function callAPI({
    method,
    url,
    header,
    body = {},
    params = {},
    ...props
}: TypeProps) {
    console.log('callAPI')
    let token = getTokenAdmin()
    if (location.pathname.includes('/admin')) {
        token = getTokenAdmin()
    }

    const contextHeader = {
        ...header,
        ...(token && token != 'undefined' ? { token: token } : {}),
    }

    if (method == 'GET') {
        return await axios.get<any>(`${url}`, { headers: contextHeader, params: params })
    } else if (method == 'POST') {
        return await axios.post<any>(`${url}`, body, { headers: contextHeader, params: params })
    } else if (method == 'PUT') {
        return await axios.put<any>(`${url}`, body, { headers: contextHeader, params: params })
    } else if (method == 'DELETE') {
        return await axios.delete<any>(`${url}`, { headers: contextHeader, params: params })
    }
}
