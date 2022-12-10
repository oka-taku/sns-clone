import React from 'react'
import Modal from 'react-modal'
import styles from './Post.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'
import {
    resetOpenCommentMenu,
    setOpenDeleteComment,
    selectOpenCommentMenu,
    setOpenEditComment,
} from './postSlice'
import { Button, useMediaQuery } from '@mui/material'

const CommentMenu: React.FC = () => {

    const isMaxWidth = useMediaQuery('(max-width: 550px)');
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",

            width: isMaxWidth ? "80%" : 400,
            height: 150,
            padding: 0,
            borderRadius: "1rem",
            overflow: "clip",

            transform: "translate(-50%, -50%)",
        },
    };
    const dispatch: AppDispatch = useDispatch();
    const openCommnetMenu = useSelector(selectOpenCommentMenu);

    return (
        <>
            <Modal
                isOpen={openCommnetMenu}
                onRequestClose={async () => {
                    await dispatch(resetOpenCommentMenu());
                }}
                style={customStyles}
            >
                <div className={styles.edit_post_menu} >
                    <div className={styles.edit_post_button_border}>
                        <Button className={styles.edit_post_button} style={{ 'color': 'red', 'fontWeight': 'bold' }}
                            onClick={() => {
                                dispatch(resetOpenCommentMenu())
                                dispatch(setOpenDeleteComment())
                            }}>
                            削除
                        </Button>
                    </div>
                    <div className={styles.edit_post_button_border}>
                        <Button className={styles.edit_post_button}
                            onClick={() => {
                                dispatch(setOpenEditComment())
                                dispatch(resetOpenCommentMenu())
                            }}>
                            編集
                        </Button>
                    </div>
                    <div>
                        <Button className={styles.edit_post_button}
                            onClick={() => {
                                dispatch(resetOpenCommentMenu())
                            }}>
                            キャンセル
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default CommentMenu