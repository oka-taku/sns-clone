import React from 'react'
import Modal from 'react-modal'
import styles from './Post.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'
import {
    fetchAsyncDeletePost,
    fetchAsyncGetPosts,
    resetOpenDelete,
    selectPostId,
    selectOpenDelete,
    fetchPostStart,
    fetchPostEnd,
} from './postSlice'
import { Button } from '@material-ui/core'

const customStyles = {
    content: {
        top: "50%",
        left: "50%",

        width: 400,
        height: 200,
        padding: 0,
        borderRadius: "1rem",

        transform: "translate(-50%, -50%)",
    },
};

const DeleteModal = () => {

    const dispatch: AppDispatch = useDispatch();
    const openPostDelete = useSelector(selectOpenDelete);
    const postId = useSelector(selectPostId);
    const deletePost = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncDeletePost(postId));
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchPostEnd());
        dispatch(resetOpenDelete());
    }

    return (
        <>
            <Modal
                isOpen={openPostDelete}
                onRequestClose={async () => {
                    await dispatch(resetOpenDelete());
                }}
                style={customStyles}
            >
                <div className={styles.delete_text}>
                    <h3>投稿を削除しますか？</h3>
                    <div className={styles.delete_text_child}>この投稿を削除しますか？</div>
                </div>
                <div className={styles.delete_menu} >
                    <div className={styles.delete_button_border}>
                        <Button className={styles.edit_post_button} style={{ 'color': 'red', 'fontWeight': 'bold' }}
                            onClick={deletePost}>
                            削除
                        </Button>
                    </div>
                    <div className={styles.delete_button_border}>
                        <Button className={styles.edit_post_button}
                            onClick={() => {
                                dispatch(resetOpenDelete())
                            }}>
                            キャンセル
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default DeleteModal