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

const PostEdit: React.FC = () => {

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
    
            width: "45%",
            height: "70%",
            minWidth: 250,
            padding: 0,
            borderRadius: "1rem",
    
            transform: "translate(-50%, -45%)",
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
                <main>
                    <img id='image' className={styles.edit_post_main_img} src={imageUrl.replace("http://snsclone.tk", "https://snsclone.tk")} alt="投稿画像" onClick={handlerEditPicture} />
                    <input
                        type="file"
                        id="imageInput"
                        hidden={true}
                        onChange={(e) => setTargetImg(e)}
                    />
                    <textarea placeholder='タイトルを入力してください' defaultValue={title} onChange={(e) => setTitle(e.target.value)} className={styles.edit_post_main_title}></textarea>

                </main>
            </Modal>
        </>
    )
}

export default PostEdit