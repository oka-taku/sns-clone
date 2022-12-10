import React, { useState } from 'react'
import Modal from 'react-modal'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'
import styles from './Post.module.css'
import {
    selectOpenEditComment,
    resetOpenEditComment,
    fetchPostStart,
    fetchPostEnd,
    selectTextComment,
    selectCommentId,
    fetchAsyncUpdateComment,
} from '../post/postSlice'
import { Button, TextField, useMediaQuery } from '@mui/material';

const CommentEdit: React.FC = () => {

    const commentId = useSelector(selectCommentId);
    const comment = useSelector(selectTextComment);
    const [inputComment, setInputComment] = useState("");
    const openEditComment = useSelector(selectOpenEditComment);
    const isMaxWidth = useMediaQuery('(max-width: 550px)');
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            overflow: "hidden",
            width: isMaxWidth ? "50%" : 250,
            height: 100,
            padding: "50px",

            transform: "translate(-50%, -50%)",
        },
    };

    const dispatch: AppDispatch = useDispatch();
    const editComment = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { id: commentId, text: inputComment }
        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncUpdateComment(packet));
        await dispatch(fetchPostEnd());
        dispatch(resetOpenEditComment());
    };

    return (
        <>
            <Modal
                isOpen={openEditComment}
                onRequestClose={async () => {
                    await dispatch(resetOpenEditComment());
                }}
                style={customStyles}
            >
                <form className={styles.edit_comment}>
                    <TextField
                        variant="standard"
                        placeholder="コメントを入力してください"
                        type="text"
                        defaultValue={comment}
                        inputProps={{style: {fontSize: isMaxWidth ? 10 : ""}}}
                        onChange={(e) => setInputComment(e.target.value)}
                    />
                    <br />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={editComment}
                    >
                        更新
                    </Button>
                </form>
            </Modal>
        </>
    )
}

export default CommentEdit