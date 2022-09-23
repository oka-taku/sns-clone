import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWPOST, PROPS_LIKED, PROPS_COMMENT, PROPS_UPDATEPOST } from "../types";

const apiUrlPost = `${process.env.REACT_APP_DEV_API_URL}api/post/`;
const apiUrlComment = `${process.env.REACT_APP_DEV_API_URL}api/comment/`;

/* 投稿の一覧取得 */
export const fetchAsyncGetPosts = createAsyncThunk("post/get", async () => {
  const res = await axios.get(apiUrlPost, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

/* 新規投稿 */
export const fetchAsyncNewPost = createAsyncThunk(
  "post/post",
  async (newPost: PROPS_NEWPOST) => {
    const uploadData = new FormData();
    uploadData.append("title", newPost.title);
    newPost.img && uploadData.append("img", newPost.img, newPost.img.name);
    const res = await axios.post(apiUrlPost, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

/* 投稿削除 */
export const fetchAsyncDeletePost = createAsyncThunk(
  "post/delete",
  async (postId: number) => {
    const res = await axios.delete(`${apiUrlPost}${postId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

/* 投稿更新 */
export const fetchAsyncUpdatePost = createAsyncThunk(
  "post/update",
  async (newPost: PROPS_UPDATEPOST) => {
    const uploadData = new FormData();
    if (newPost.title !== "") {
      uploadData.append("title", newPost.title);
    }
    newPost.img && uploadData.append("img", newPost.img, newPost.img.name);
    const res = await axios.patch(`${apiUrlPost}${newPost.postId}/`, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

/* いいね押下時API */
export const fetchAsyncPatchLiked = createAsyncThunk(
  "post/patch",
  async (liked: PROPS_LIKED) => {
    const currentLiked = liked.current;
    const uploadData = new FormData();

    let isOverlapped = false;
    currentLiked.forEach((current) => {
      if (current === liked.new) {
        isOverlapped = true;
      } else {
        uploadData.append("liked", String(current));
      }
    });

    if (!isOverlapped) {
      uploadData.append("liked", String(liked.new));
    } else if (currentLiked.length === 1) {
      uploadData.append("title", liked.title);
      const res = await axios.put(`${apiUrlPost}${liked.id}/`, uploadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return res.data;
    }
    const res = await axios.patch(`${apiUrlPost}${liked.id}/`, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

/* コメント取得 */
export const fetchAsyncGetComments = createAsyncThunk(
  "comment/get",
  async () => {
    const res = await axios.get(apiUrlComment, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

/* コメント新規作成 */
export const fetchAsyncPostComment = createAsyncThunk(
  "comment/post",
  async (comment: PROPS_COMMENT) => {
    const res = await axios.post(apiUrlComment, comment, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState: {
    isLoadingPost: false,
    openNewPost: false,
    openPostMenu: false,
    openEditPost: false,
    openDelete: false,
    postId: 0,
    title: "",
    imageUrl: "",
    posts: [
      {
        id: 0,
        title: "",
        userPost: 0,
        created_on: "",
        img: "",
        liked: [0],
      },
    ],
    comments: [
      {
        id: 0,
        text: "",
        userComment: 0,
        post: 0,
      },
    ],
  },
  reducers: {
    fetchPostStart(state) {
      state.isLoadingPost = true;
    },
    fetchPostEnd(state) {
      state.isLoadingPost = false;
    },
    setOpenNewPost(state) {
      state.openNewPost = true;
    },
    resetOpenNewPost(state) {
      state.openNewPost = false;
    },
    setOpenPostMenu(state, postId: any) {
      state.openPostMenu = true;
      state.postId = postId.payload;
    },
    resetOpenPostMenu(state) {
      state.openPostMenu = false;
    },
    setOpenEditPost(state) {
      state.openEditPost = true;
    },
    resetOpenEditPost(state) {
      state.openEditPost = false;
    },
    setOpenDelete(state) {
      state.openDelete = true;
    },
    resetOpenDelete(state) {
      state.openDelete = false;
    },
    setTitle(state, title: any) {
      state.title = title.payload
    },
    setImageUrl(state, imageUrl: any) {
      state.imageUrl = imageUrl.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
      return {
        ...state,
        posts: action.payload,
      };
    });
    builder.addCase(fetchAsyncNewPost.fulfilled, (state, action) => {
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    });
    builder.addCase(fetchAsyncUpdatePost.fulfilled, (state, action) => {
      return {
        ...state,
        posts: state.posts.map((post) =>
        post.id === action.payload.id ? action.payload : post
      ),
      };
    });
    builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
      return {
        ...state,
        comments: action.payload,
      };
    });
    builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };
    });
    builder.addCase(fetchAsyncPatchLiked.fulfilled, (state, action) => {
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    });
  },
});

export const {
  fetchPostStart,
  fetchPostEnd,
  setOpenNewPost,
  resetOpenNewPost,
  setOpenPostMenu,
  resetOpenPostMenu,
  setOpenEditPost,
  resetOpenEditPost,
  setOpenDelete,
  resetOpenDelete,
  setTitle,
  setImageUrl,
} = postSlice.actions;

export const selectIsLoadingPost = (state: RootState) =>
  state.post.isLoadingPost;
export const selectOpenNewPost = (state: RootState) => state.post.openNewPost;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectComments = (state: RootState) => state.post.comments;
export const selectOpenPostMenu = (state: RootState) => state.post.openPostMenu;
export const selectOpenEditPost = (state: RootState) => state.post.openEditPost;
export const selectOpenDelete = (state: RootState) => state.post.openDelete;
export const selectPostId = (state: RootState) => state.post.postId;
export const selectTitle = (state: RootState) => state.post.title;
export const selectImageUrl = (state: RootState) => state.post.imageUrl;

export default postSlice.reducer;
