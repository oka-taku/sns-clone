import React, { useState } from 'react'
import Modal from 'react-modal'
import styles from './Post.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'
import {
    fetchAsyncUpdatePost,
    resetOpenEditPost,
    selectOpenEditPost,
    selectPostId,
    selectTitle,
    selectImageUrl,
    fetchPostStart,
    fetchPostEnd,
} from './postSlice'
import { useMediaQuery } from '@mui/material'
import TextareaAutosize from '@mui/base/TextareaAutosize';


const PostEdit: React.FC = () => {
    const isMaxWidth = useMediaQuery('(max-width: 1024px)');
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            overflowy: "scroll",
    
            width: isMaxWidth ? "80%" : "50%",
            height: "60%",
            minWidth: 250,
            padding: 0,
            borderRadius: "1rem",
    
            transform: "translate(-50%, -40%)",
        },
    };
    const dispatch: AppDispatch = useDispatch();
    const openEditPost = useSelector(selectOpenEditPost);
    const postId = useSelector(selectPostId);
    const title = useSelector(selectTitle);
    const imageUrl = useSelector(selectImageUrl);
    const [image, setImage] = useState<File | null>(null);
    const [editTitle, setTitle] = useState("");

    const handlerEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
    };
    const editPost = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { title: editTitle, img: image, postId: postId }
        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncUpdatePost(packet));
        await dispatch(fetchPostEnd());
        setTitle("");
        setImage(null);
        dispatch(resetOpenEditPost());
    }

    const setTargetImg = (e: any) => {
        const fileInput: any = document.getElementById("imageInput");
        if (!(fileInput.value)) return;
        const reader = new FileReader();
        setImage(e.target.files![0]);
        reader.onload = (e: any) => {
            const img = document.getElementById("image");
            img?.setAttribute("src", e.target?.result);
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    return (
        <>
            <Modal
                isOpen={openEditPost}
                onRequestClose={async () => {
                    await dispatch(resetOpenEditPost());
                }}
                style={customStyles}
            >
                <header className={styles.edit_post_header}>
                    <div>
                        <button className={styles.edit_post_header_button}
                            onClick={() => dispatch(resetOpenEditPost())}
                        >キャンセル</button>
                    </div>
                    <strong>情報を編集</strong>
                    <div>
                        <button className={styles.edit_post_header_button} style={{ color: 'rgb(0, 149, 246)', fontWeight: '600' }}
                            onClick={editPost}>完了</button>
                    </div>
                </header>
                <main style={{height: "90%"}}>
                    <img id='image' className={styles.edit_post_main_img} src={imageUrl.replace("http://snsclone.tk", "https://snsclone.tk")} alt="投稿画像" onClick={handlerEditPicture} />
                    <input
                        type="file"
                        id="imageInput"
                        hidden={true}
                        onChange={(e) => setTargetImg(e)}
                    />
                    <TextareaAutosize placeholder='タイトルを入力してください' defaultValue={title} onChange={(e) => setTitle(e.target.value)} className={styles.edit_post_main_title} maxRows={2} />
                </main>
            </Modal>
        </>
    )
}

export default PostEdit