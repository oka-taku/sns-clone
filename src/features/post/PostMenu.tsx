import React from 'react'
import Modal from 'react-modal'
import styles from './Post.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'
import {
    resetOpenPostMenu,
    setOpenDelete,
    selectOpenPostMenu,
    setOpenEditPost,
} from './postSlice'
import { Button } from '@mui/material'

const customStyles = {
    content: {
        top: "50%",
        left: "50%",

        width: 400,
        height: 150,
        padding: 0,
        borderRadius: "1rem",
        overflow: "clip",

        transform: "translate(-50%, -50%)",
    },
};

const PostMenu: React.FC = () => {

    const dispatch: AppDispatch = useDispatch();
    const openPostMenu = useSelector(selectOpenPostMenu);

    return (
        <>
            <Modal
                isOpen={openPostMenu}
                onRequestClose={async () => {
                    await dispatch(resetOpenPostMenu());
                }}
                style={customStyles}
            >
                <div className={styles.edit_post_menu} >
                    <div className={styles.edit_post_button_border}>
                        <Button className={styles.edit_post_button} style={{ 'color': 'red', 'fontWeight': 'bold' }}
                            onClick={() => {
                                dispatch(resetOpenPostMenu())
                                dispatch(setOpenDelete())
                            }}>
                            削除
                        </Button>
                    </div>
                    <div className={styles.edit_post_button_border}>
                        <Button className={styles.edit_post_button}
                            onClick={() => {
                                dispatch(setOpenEditPost())
                                dispatch(resetOpenPostMenu())
                            }}>
                            編集
                        </Button>
                    </div>
                    <div>
                        <Button className={styles.edit_post_button}
                            onClick={() => {
                                dispatch(resetOpenPostMenu())
                            }}>
                            キャンセル
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default PostMenu