import { useSelector } from 'react-redux'
import Modal from 'react-modal'
import SignIn from './SignIn'
import SignUp from './SignUp'
import {
    selectOpenSignIn,
    selectOpenSignUp,
} from './authSlice'
import { useMediaQuery } from '@mui/material'

const customStyles = {
    overlay: {
        backgroundColor: "#777777",
    },
    content: {
        top: "55%",
        left: "50%",

        width: 280,
        height: 350,
        padding: "50px",

        transform: "translate(-50%, -50%)",
    },
}

const Auth: React.FC = () => {
    Modal.setAppElement("#root");
    const openSignIn = useSelector(selectOpenSignIn);
    const openSignUp = useSelector(selectOpenSignUp);
    const isMaxWidth = useMediaQuery("(max-width: 550px)");

    return (
        <>
            {isMaxWidth ?
                openSignIn ? <SignIn /> : <SignUp />
                :
                <>
                    <Modal
                        isOpen={openSignIn}
                        style={customStyles}
                    >
                        <SignIn />
                    </Modal>

                    <Modal
                        isOpen={openSignUp}
                        style={customStyles}
                    >
                        <SignUp />
                    </Modal>    
                </>
            }
        </>
    )
}

export default Auth