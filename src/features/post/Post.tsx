import React, { useState } from 'react'
import styles from './Post.module.css'
import { Avatar, Divider, Checkbox } from '@mui/material'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { AvatarGroup } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { BsThreeDots } from 'react-icons/bs'
import { IconContext } from 'react-icons'
import { AppDispatch } from '../../app/store'
import { selectProfiles } from '../auth/authSlice'
import {
    setOpenPostMenu,
    setTitle,
    setImageUrl,
    selectComments,
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncPostComment,
    fetchAsyncPatchLiked,
} from './postSlice'
import { PROPS_POST } from '../types'

const Post: React.FC<PROPS_POST> = ({
    postId,
    loginId,
    userPost,
    title,
    imageUrl,
    liked,
}) => {

    const dispatch: AppDispatch = useDispatch();
    const profiles = useSelector(selectProfiles);
    const comments = useSelector(selectComments);
    const [text, setText] = useState("");

    const commentsOnPost = comments.filter((com) => {
        return com.post === postId;
    });

    const prof = profiles.filter((prof) => {
        return prof.userProfile === userPost;
    });

    const postComment = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { text: text, post: postId };
        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncPostComment(packet));
        await dispatch(fetchPostEnd());
        setText("");
    }

    const handlerLiked = async () => {
        const packet = {
            id: postId,
            title: title,
            current: liked,
            new: loginId,
        };
        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncPatchLiked(packet));
        await dispatch(fetchPostEnd());
    };

    if (title) {
        return (
            <div className={styles.post}>
                <div className={styles.post_header}>
                    <Avatar className={styles.post_avatar} src={prof[0]?.img?.replace("http://snsclone.tk", "https://snsclone.tk")} />
                    <h3>{prof[0]?.nickName}</h3>
                    {
                        loginId === userPost ?
                            <button
                                className={styles.post_three_point_leader}
                                onClick={() => {
                                    dispatch(setOpenPostMenu(postId));
                                    dispatch(setTitle(title));
                                    dispatch(setImageUrl(imageUrl));
                                }}
                            >
                                <IconContext.Provider value={{ size: '1.5rem' }}>
                                    <BsThreeDots />
                                </IconContext.Provider>
                            </button> : null
                    }

                </div>

                <img className={styles.post_image} src={imageUrl.replace("http://snsclone.tk", "https://snsclone.tk")} alt="" />

                <h4 className={styles.post_text}>
                    <Checkbox
                        className={styles.post_checkBox}
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite sx={{ color: "#f50057" }} />}
                        checked={liked.some((like) => like === loginId)}
                        onChange={handlerLiked}
                    />
                    <strong> {prof[0]?.nickName}</strong> {title}
                    <AvatarGroup max={7}>
                        {liked.map((like) => (
                            <Avatar
                                className={styles.post_avatarGroup}
                                key={like}
                                src={profiles.find((prof) => prof.userProfile === like)?.img.replace("http://snsclone.tk", "https://snsclone.tk")}
                            />
                        ))}

                    </AvatarGroup>
                </h4>

                <Divider />
                <div className={styles.post_comments}>
                    {commentsOnPost.map((comment) => (
                        <div key={comment.id} className={styles.post_comment}>
                            <Avatar
                                src={
                                    profiles.find(
                                        (prof) => prof.userProfile === comment.userComment
                                    )?.img.replace("http://snsclone.tk", "https://snsclone.tk")
                                }
                                sx={{w: 3, h: 3, mr: 1}}
                            />
                            <p>
                                <strong className={styles.post_strong}>
                                    {
                                        profiles.find(
                                            (prof) => prof.userProfile === comment.userComment
                                        )?.nickName
                                    }
                                </strong>
                                {comment.text}
                            </p>
                        </div>
                    ))}
                </div>

                <form className={styles.post_commentBox}>
                    <input
                        className={styles.post_input}
                        type="text"
                        placeholder="コメントを追加…"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button
                        disabled={!text.length}
                        className={styles.post_button}
                        type="submit"
                        onClick={postComment}
                    >
                        投稿する
                    </button>
                </form>
            </div>
        )
    }
    return null;
}

export default Post