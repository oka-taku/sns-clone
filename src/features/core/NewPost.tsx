import React, { useState } from 'react'
import Modal from 'react-modal'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'
import styles from './Core.module.css'
import { File } from '../types'
import {
    selectOpenNewPost,
    resetOpenNewPost,
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncNewPost,
} from '../post/postSlice'
import { Button, TextField, IconButton, useMediaQuery } from '@mui/material';
import { MdAddAPhoto } from 'react-icons/md'

const NewPost: React.FC = () => {

    const isMaxWidth = useMediaQuery('(max-width: 550px)');
    const customStyles = {
        content: {
            top: "55%",
            left: "50%",
            overflow: "hidden",
            width: isMaxWidth ? "50%" : 280,
            height: 220,
            padding: "50px",

            transform: "translate(-50%, -50%)",
        },
    };

    const dispatch: AppDispatch = useDispatch();
    const openNewPost = useSelector(selectOpenNewPost);

    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState("");

    const handlerEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
    };

    const newPost = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { title: title, img: image };
        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncNewPost(packet));
        await dispatch(fetchPostEnd());
        setTitle("");
        setImage(null);
        dispatch(resetOpenNewPost());
    };

    return (
        <>
            <Modal
                isOpen={openNewPost}
                onRequestClose={async () => {
                    await dispatch(resetOpenNewPost());
                }}
                style={customStyles}
            >
                <form className={styles.core_signUp}>
                    <h1 className={styles.core_title}>SNS clone</h1>

                    <br />
                    <TextField
                        variant="standard"
                        label="タイトルを入力してください"
                        type="text"
                        inputProps={{style: {fontSize: isMaxWidth ? 10 : 15}}}
                        InputLabelProps={{style: {fontSize: isMaxWidth ? 10 : 15}}}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <input
                        type="file"
                        id="imageInput"
                        hidden={true}
                        onChange={(e) => setImage(e.target.files![0])}
                    />
                    <br />
                    <IconButton onClick={handlerEditPicture}>
                        <MdAddAPhoto />
                    </IconButton>
                    <br />

                    <Button
                        disabled={!title || !image}
                        variant="contained"
                        color="primary"
                        onClick={newPost}
                    >
                        投稿
                    </Button>
                </form>
            </Modal>
        </>
    )
}

export default NewPost