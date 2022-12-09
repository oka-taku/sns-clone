import { useSelector } from 'react-redux'
import Modal from 'react-modal'
import SignIn from './SignIn'
import SignUp from './SignUp'
import {
    selectOpenSignIn,
} from './authSlice'

const Auth: React.FC = () => {
    Modal.setAppElement("#root");
    const openSignIn = useSelector(selectOpenSignIn);

    return (
        <>
            {openSignIn ? <SignIn /> : <SignUp />}
        </>
    )
}

export default Auth