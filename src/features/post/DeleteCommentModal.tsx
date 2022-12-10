import React from 'react'
import Modal from 'react-modal'
import styles from './Post.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'
import {
    resetOpenDeleteComment,
    selectCommentId,
    selectOpenDeleteComment,
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncDeleteComment,
} from './postSlice'
import { Button, useMediaQuery } from '@mui/material'


const DeleteCommentModal = () => {

    const isMaxWidth = useMediaQuery('(max-width: 550px)');
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
    
            width: isMaxWidth ? "80%" : 400,
            height: 200,
            padding: 0,
            borderRadius: "1rem",
    
            transform: "translate(-50%, -50%)",
        },
    };
    const dispatch: AppDispatch = useDispatch();
    const openDeleteComment = useSelector(selectOpenDeleteComment);
    const commentId = useSelector(selectCommentId);
    const deleteComment = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncDeleteComment(commentId));
        await dispatch(fetchPostEnd());
        dispatch(resetOpenDeleteComment());
    }

    return (
        <>
            <Modal
                isOpen={openDeleteComment}
                onRequestClose={async () => {
                    await dispatch(resetOpenDeleteComment());
                }}
                style={customStyles}
            >
                <div className={styles.delete_text}>
                    <h3>コメントを削除しますか？</h3>
                    <div className={styles.delete_text_child}>このコメントを削除しますか？</div>
                </div>
                <div className={styles.delete_menu} >
                    <div className={styles.delete_button_border}>
                        <Button className={styles.edit_post_button} style={{ 'color': 'red', 'fontWeight': 'bold' }}
                            onClick={deleteComment}>
                            削除
                        </Button>
                    </div>
                    <div className={styles.delete_button_border}>
                        <Button className={styles.edit_post_button}
                            onClick={() => {
                                dispatch(resetOpenDeleteComment())
                            }}>
                            キャンセル
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default DeleteCommentModal