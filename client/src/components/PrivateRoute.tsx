import { Outlet, Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function PrivateRoutes() {
    const token = useAuth()
    return token ? <Outlet /> : <Navigate to='/' />
}

export default PrivateRoutes