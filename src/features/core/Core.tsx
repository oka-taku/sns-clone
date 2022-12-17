import React, { useEffect } from 'react'
import Auth from '../auth/Auth'
import Post from '../post/Post'
import styles from './Core.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'
import {
    Button,
    Grid,
    Avatar,
} from '@mui/material'
import { MdAddAPhoto } from 'react-icons/md'
import {
    editNickname,
    editId,
    selectProfile,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    setOpenProfile,
    resetOpenProfile,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
} from '../auth/authSlice'
import {
    selectPosts,
    setOpenNewPost,
    resetOpenNewPost,
    fetchAsyncGetPosts,
    fetchAsyncGetComments,
    resetOpenPostMenu,
    resetOpenEditPost,
    resetOpenDelete,
    resetOpenCommentMenu,
    resetOpenDeleteComment,
    resetOpenEditComment,
} from '../post/postSlice'
import EditProfile from './EditProfile'
import NewPost from './NewPost'
import PostMenu from '../post/PostMenu'
import PostEdit from '../post/PostEdit'
import DeleteModal from '../post/DeleteModal'
import CommentMenu from '../post/CommentMenu'
import DeleteCommentModal from '../post/DeleteCommentModal'
import CommentEdit from '../post/CommentEdit'
import { HTTP_URL, HTTPS_URL } from '../constant'

const Core: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const posts = useSelector(selectPosts);

    useEffect(() => {
        const fetchBootLoader = async () => {
            if (localStorage.localJWT) {
                dispatch(resetOpenSignIn());
                const result = await dispatch(fetchAsyncGetMyProf());
                if (fetchAsyncGetMyProf.rejected.match(result)) {
                    dispatch(setOpenSignIn());
                    return null;
                }
                await dispatch(fetchAsyncGetPosts());
                await dispatch(fetchAsyncGetProfs());
                await dispatch(fetchAsyncGetComments());
            }
        };
        fetchBootLoader();
    }, [dispatch]);

    return (
        <div>
            <div className={styles.core_header}>
                <h1 className={styles.core_title}>SNS clone</h1>
                {localStorage.getItem('localJWT') && profile?.id ?
                    <>
                        <button
                            className={styles.core_btnModal}
                            onClick={() => {
                                dispatch(setOpenNewPost());
                                dispatch(resetOpenProfile());
                                dispatch(resetOpenPostMenu());
                                dispatch(resetOpenDelete());
                                dispatch(resetOpenEditPost());
                                dispatch(resetOpenCommentMenu());
                                dispatch(resetOpenDeleteComment());
                                dispatch(resetOpenEditComment());
                            }}>
                            <MdAddAPhoto />
                        </button>
                        <div className={styles.core_logout}>
                            <Button color='inherit'
                                className={styles.core_logout_btn}
                                onClick={() => {
                                    localStorage.removeItem("localJWT");
                                    dispatch(editNickname(""));
                                    dispatch(editId(0));
                                    dispatch(resetOpenProfile());
                                    dispatch(resetOpenNewPost());
                                    dispatch(resetOpenPostMenu());
                                    dispatch(resetOpenDelete());
                                    dispatch(resetOpenEditPost());
                                    dispatch(resetOpenCommentMenu());
                                    dispatch(resetOpenDeleteComment());
                                    dispatch(resetOpenEditComment());
                                    dispatch(setOpenSignIn());
                                }}>
                                ログアウト
                            </Button>

                            <button
                                className={styles.core_btnModal}
                                onClick={() => {
                                    dispatch(setOpenProfile());
                                    dispatch(resetOpenNewPost());
                                    dispatch(resetOpenPostMenu());
                                    dispatch(resetOpenEditPost());
                                    dispatch(resetOpenDelete());
                                    dispatch(resetOpenCommentMenu());
                                    dispatch(resetOpenDeleteComment());
                                    dispatch(resetOpenEditComment());
                                }}
                            >
                                <Avatar className={styles.core_avator} alt="who?" src={profile.img?.replace(HTTP_URL, HTTPS_URL)} />{" "}
                            </button>
                        </div>
                    </> :
                    <div>
                        <Button
                            color='inherit'
                            onClick={() => {
                                dispatch(setOpenSignIn());
                                dispatch(resetOpenSignUp());
                            }}
                        >
                            ログイン
                        </Button>
                        <Button
                            color='inherit'
                            onClick={() => {
                                dispatch(setOpenSignUp());
                                dispatch(resetOpenSignIn());
                            }}
                        >
                            サインアップ
                        </Button>
                    </div>
                }
            </div>

            {localStorage.getItem('localJWT') && profile?.id ? <>
                <div className={styles.core_posts}>
                    <Grid container spacing={4}>
                        {posts
                            .slice(0)
                            .reverse()
                            .map((post) => (
                                <Grid key={post.id} item xs={12} md={4} sm={6}>
                                    <Post
                                        postId={post.id}
                                        title={post.title}
                                        loginId={profile.userProfile}
                                        userPost={post.userPost}
                                        imageUrl={post.img}
                                        liked={post.liked}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </> : null}
            {!localStorage.getItem('localJWT') || !profile.id ? <Auth /> : null}
            <EditProfile />
            <NewPost />
            <PostMenu />
            <PostEdit />
            <DeleteModal />
            <CommentMenu />
            <DeleteCommentModal />
            <CommentEdit />
        </div>
    )
}

export default Core